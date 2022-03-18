const http = require('http')
const axios = require('axios').default
const fs = require('fs')
const static = require('./static.js')

const {parse} = require('querystring')
const internal = require('stream')

function generatePendingTasks(tasks) {
    page = `<ul class="flex flex-col mt-8 bg-zinc-300 text-zinc-900 rounded-lg">\n`
    tasks.forEach(task => {
        page += `   <li class="border-b-2 border-zinc-500 min-h-fit last:border-b-0 hover:bg-zinc-400 first:rounded-t-lg last:rounded-b-lg">
        <div class="flex justify-between px-5 py-2">
            <div class="">
                <p class="text-2xl">${task.title}</p>
                <p class="text-lg font-light">${task.description}</p>
            </div>
            <div class="self-center text-2xl flex gap-6">
                <a href="/tasks/${task.id}/edit" title="Edit this task">✏️</a>
                <a href="/tasks/${task.id}/complete" title="Mark this task as complete">✅</a>
            </div>
        </div>
    </li>\n`
    })
    page += "</ul>\n"
    return page
}

function generateEditTasks(tasks, task_id) {
    page = `<ul class="flex flex-col mt-8 bg-zinc-300 text-zinc-900 rounded-lg">\n`
    tasks.forEach(task => {
        if (task.id == task_id) {
            page += `   <li class="border-b-2 bg-zinc-400 border-zinc-500 h-min last:border-b-0 first:rounded-t-lg last:rounded-b-lg">
        <form action="/tasks/${task.id}/edit" method="POST" class="flex justify-between items-center px-5 py-2 gap-6">
            <div class="flex flex-col w-full">
                <input type="text" id="title" name="title" class="w-full md:w-2/3 bg-zinc-300 border-0 border-b-[1px] border-zinc-500 placeholder:text-zinc-500 text-2xl" placeholder="Drink water!" value="${task.title}"/>
                <textarea id="descrition" name="description" class="bg-zinc-300 border-0 placeholder:text-zinc-400 text-lg font-light w-full" placeholder="At least 2 liters a day...">${task.description}</textarea>
            </div>
            <input type="hidden" name="status" value="pending">
            <div class="flex gap-4 flex-col 2xl:flex-row">
                <input type="submit" value="Submit" class="hover:cursor-pointer bg-green-600 hover:bg-green-700 text-zinc-200 py-3 px-6 rounded-2xl whitespace-normal break-words w-36 font-bold text-xl"/>
                <a href="/" class="bg-red-600 hover:bg-red-700 text-zinc-200 py-3 px-6 rounded-2xl whitespace-normal break-words w-36 font-bold text-xl text-center">Cancel</a>
            </div>
        </form>
    </li>\n`
        }
        else {
            page += `   <li class="border-b-2 border-zinc-500 min-h-fit last:border-b-0 hover:bg-zinc-400 first:rounded-t-lg last:rounded-b-lg">
        <div class="flex justify-between px-5 py-2">
            <div class="">
                <p class="text-2xl">${task.title}</p>
                <p class="text-lg font-light">${task.description}</p>
            </div>
            <div class="self-center text-2xl flex gap-6">
                <a href="/tasks/${task.id}/edit" title="Edit this task">✏️</a>
                <a href="/tasks/${task.id}/complete" title="Mark this task as complete">✅</a>
            </div>
        </div>
    </li>\n`
        }
    })
    page += "</ul>\n"
    return page
}

function generateCompletedTasks(tasks) {
    page = `<ul class="flex flex-col mt-8 bg-zinc-300 text-zinc-900 rounded-lg">\n`
    tasks.forEach(task => {
        page += `   <li class="border-b-2 border-zinc-500 min-h-fit last:border-b-0 hover:bg-zinc-400 first:rounded-t-lg last:rounded-b-lg">
        <div class="flex justify-between px-5 py-2">
            <div class="">
                <p class="text-2xl">${task.title}</p>
                <p class="text-lg font-light">${task.description}</p>
            </div>
            <div class="self-center text-2xl">
                <a href="/tasks/${task.id}/delete" title="Delete this task">❌</a>
            </div>
        </div>
    </li>\n`
    })
    page += "</ul>\n"
    return page
}

function recoverInfo(request, callback) {
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''
        request.on('data', block => {
            body += block.toString()
        })
        request.on('end', () => {
            console.log(body)
            callback(parse(body))
        })
    }
}

const server = http.createServer(function (req, res) {

    console.log(req.method + " " + req.url)

    // Tratamento do pedido
    if(static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req, res)
        return
    }

    switch(req.method){
        case "GET": 
            if(req.url == "/" || /\/tasks\/[0-9]+\/edit/.test(req.url)){
                let task_id = null;
                if (req.url.length > 1)
                    task_id = req.url.split('/')[2]
                fs.readFile("index.html", (err, data) => {
                    if(err) throw "Index.html file not found!"
                    var template = data.toString('utf-8')
                    axios.get("http://localhost:3000/tasks?status=pending")
                        .then(response => {
                            const tasks = response.data
                            if(task_id === null)
                                var pendingTasks = generatePendingTasks(tasks)
                            else {
                                var pendingTasks = generateEditTasks(tasks, task_id)
                            }
                            axios.get("http://localhost:3000/tasks?status=completed")
                            .then(response => {
                                const tasks = response.data
                                var completedTasks = generateCompletedTasks(tasks)
                                template = template.replace("${pending}", pendingTasks).replace("${completed}", completedTasks)
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(template)
                                res.end()
                            }).catch(error => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Não foi possível obter a lista de tarefas completadas...</p>")
                                res.end()
                            })
                    }).catch(error => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de tarefas pendentes...</p>")
                        res.end()
                    })
                })
            }
            else if (/\/tasks\/[0-9]+\/complete/.test(req.url)) {
                console.log("wtf")
                const task_id = req.url.split('/')[2]
                axios.get("http://localhost:3000/tasks/" + task_id).then(resp => {
                    const task = resp.data
                    task['status'] = 'completed'
                    axios.put('http://localhost:3000/tasks/' + task_id, task).then(resp => {
                        res.writeHead(303, {'Location': '/'}).end()
                    }).catch(erro => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Erro no PUT: " + erro + '</p>')
                        res.end()
                    })
                }).catch(error => {
                    console.log(error)
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(`<p>Não foi possível obter a tarefa ${task_id}...</p>`)
                    res.end()
                })
            }
            else if (/\/tasks\/[0-9]+\/delete\/?/.test(req.url)) {
                const task_id = req.url.split('/')[2]
                axios.delete('http://localhost:3000/tasks/' + task_id).then(resp => {
                    res.writeHead(303, {'Location': '/'}).end()
                }).catch(erro => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>Erro no DELETE: " + erro + '</p>')
                    res.end()
                })
            }
            // GET /alunos/:id --------------------------------------------------------------------
            // else if(/\/alunos\/(A|PG)[0-9]+$/.test(req.url)){
            //     var idAluno = req.url.split("/")[2]
            //     axios.get("http://localhost:3000/alunos?Id=" + idAluno)
            //         .then( response => {
            //             let a = response.data[0]
            //             res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            //             res.write(geraPagAluno(a, d))
            //             res.end()
            //             // Add code to render page with the student record
            //         })
            // }
            // GET /alunos/registo --------------------------------------------------------------------
            // else if(req.url == "/alunos/registo"){
            //     res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            //     res.write(geraFormAluno(d))
            //     res.end()
            //     // Add code to render page with the student form
            // }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
        case "POST":
            if(req.url.startsWith("/tasks")) {
                recoverInfo(req, result => {
                    console.log("POST de tarefa: "+ JSON.stringify(result))
                    if(req.url == "/tasks") {
                        axios.post('http://localhost:3000/tasks', result).then(resp => {
                            res.writeHead(303, {'Location': '/'}).end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Erro no POST: " + erro + '</p>')
                            res.end()     
                        })
                    }
                    else if(/\/tasks\/[0-9]+\/edit/.test(req.url)) {
                        const task_id = req.url.split('/')[2]
                        result['id'] = task_id
                        axios.put('http://localhost:3000/tasks/' + task_id, result).then(resp => {
                            res.writeHead(303, {'Location': '/'}).end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Erro no POST: " + erro + '</p>')
                            res.end()     
                        })
                    }
                })
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                // Replace this code with a POST request to the API server
                res.write('<p>Recebi um POST não suportado</p>')
                res.write('<p><a href="/">Voltar</a></p>')
                res.end()
            }
            break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end()
    }
})

server.listen(7777)
console.log('Servidor à escuta na porta 7777...')