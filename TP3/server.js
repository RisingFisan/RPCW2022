const http = require('http')
const fs = require('fs')
const axios = require('axios').default

async function alunos(myResolve, myReject) {
    page = `<h2 class="text-white text-center text-3xl font-semibold mb-4">Alunos</h2>
<table class="text-white border-2 border-gray-200 my-0 mx-auto">
  <tr class="border-2 border-gray-200">
    <th class="border-2 border-gray-200">ID</th>
    <th class="border-2 border-gray-200">Nome</th>
    <th class="border-2 border-gray-200 px-2">Curso</th>
    <th class="border-2 border-gray-200">Instrumento</th>
  </tr>
`
    const resp = await axios.get('http://localhost:3000/alunos')
    .catch(error => {
        myReject(error)
    })

    const alunos = resp.data
    alunos.forEach(aluno => {
        page += `  <tr class="border-[1px] border-gray-200">
    <td class="border-[1px] border-gray-200 px-1">${aluno.id}</td>
    <td class="border-[1px] border-gray-200 px-1"><a href="http://localhost:4000/alunos/${aluno.id}" class="block">${aluno.nome}</a></td>
    <td class="border-[1px] border-gray-200 px-1">${aluno.curso}</td>
    <td class="border-[1px] border-gray-200 px-1">${aluno.instrumento}</td>
  </tr></a>
`
    })
    page += "</table>"
    myResolve(page)
}

async function instrumentos(myResolve, myReject) {
    page = `<h2 class="text-white text-center text-3xl font-semibold mb-4">Instrumentos</h2>
<table class="text-white border-2 border-gray-200 my-0 mx-auto">
  <tr class="border-2 border-gray-200">
    <th class="border-2 border-gray-200">ID</th>
    <th class="border-2 border-gray-200">Nome</th>
  </tr>
`
    const resp = await axios.get('http://localhost:3000/instrumentos')
    .catch(error => {
        myReject(error)
    })

    const instrumentos = resp.data
    instrumentos.forEach(instrumento => {
        page += `  <tr class="border-[1px] border-gray-200">
    <td class="border-[1px] border-gray-200 px-1">${instrumento.id}</td>
    <td class="border-[1px] border-gray-200 px-1">${instrumento["#text"]}</td>
  </tr>
`
    })
    page += "</table>"
    myResolve(page)
}

async function cursos(myResolve, myReject) {
    page = `<h2 class="text-white text-center text-3xl font-semibold mb-4">Cursos</h2>
<table class="text-white border-2 border-gray-200 my-0 mx-auto">
  <tr class="border-2 border-gray-200">
    <th class="border-2 border-gray-200">ID</th>
    <th class="border-2 border-gray-200">Designação</th>
    <th class="border-2 border-gray-200 px-2">Duração (anos)</th>
    <th class="border-2 border-gray-200">Instrumento</th>
  </tr>
`
    const resp = await axios.get('http://localhost:3000/cursos')
    .catch(error => {
        myReject(error)
    })

    const cursos = resp.data
    cursos.forEach(curso => {
        page += `  <tr class="border-[1px] border-gray-200">
    <td class="border-[1px] border-gray-200 px-1">${curso.id}</td>
    <td class="border-[1px] border-gray-200 px-1">${curso.designacao}</td>
    <td class="border-[1px] border-gray-200 px-1 text-center">${curso.duracao}</td>
    <td class="border-[1px] border-gray-200 px-1">${curso.instrumento['#text']}</td>
  </tr>
`
    })
    page += "</table>"
    myResolve(page)
}

function aluno(data) {
    page = `  <div class="text-white px-8">
    <h2 class="text-2xl pb-6">${data['id']}: ${data['nome']}</h2>
    <p><b>Data de nascimento:</b> ${data['dataNasc']}</p>
    <p><b>Curso:</b> ${data['curso']} (${data['anoCurso']}º ano)</p>
    <p><b>Intrumento:</b> ${data['instrumento']}</p>
  </div>
`
    return page
}

function send404(res) {
    fs.readFile("404.html", function (err, data) {
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
        if(err) res.write("<p>404 page not found</p>")
        else res.write(data)
        res.end()
    })
}

http.createServer(function (req, res) {
    console.log(req.url)
    if(req.url.endsWith(".css")) {
        fs.readFile(req.url.slice(1), function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'})
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css; charset=utf-8'})
                res.write("<p>CSS file could not be loaded</p>")
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'})
                res.write(data)
            }
            res.end()
        })
        return
    }
    fs.readFile('./index.html', function (err, data) {
        if (err) throw "Index file not found!"
        else {
            template = data.toString('utf-8')
            if(req.url == "/") {
                fs.readFile('src/mainPage.html', function (err, data) {
                    page = template.replace("${yield}",data)
                    if(err) throw "Main page file not found!"
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(page)
                    res.end()
                })
            }
            else if(req.url == "/alunos" || req.url == "/alunos/") {
                let myPromise = new Promise(alunos)
                myPromise.then(page => {
                    page = template.replace("${yield}",page)
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(page)
                    res.end()
                }, err => { console.log(err); send404(res) })
            }
            else if(req.url == "/cursos" || req.url == "/cursos/") {
                let myPromise = new Promise(cursos)
                myPromise.then(page => {
                    page = template.replace("${yield}",page)
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(page)
                    res.end()
                }, err => { console.log(err); send404(res) })
            }
            else if(req.url == "/instrumentos" || req.url == "/instrumentos/") {
                let myPromise = new Promise(instrumentos)
                myPromise.then(page => {
                    page = template.replace("${yield}",page)
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(page)
                    res.end()
                }, err => { console.log(err); send404(res) })
            }
            else if(req.url.startsWith("/alunos/") && req.url.split('/').length == 3) {
                axios.get("http://localhost:3000/alunos/" + req.url.split('/').slice(2)).then(resp => {
                    page = template.replace("${yield}", aluno(resp.data))
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(page)
                    res.end()
                }).catch(error => {
                    console.log(error)
                    send404(res)
                })
            }
            else send404(res)
        }
    })
}).listen(4000, function () {
    console.log("Servidor à escuta na porta 4000...")
})