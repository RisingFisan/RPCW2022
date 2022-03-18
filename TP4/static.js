/*
    Module Static - to serve static resources in public folder
    Exports: 
        Bool recursoEstatico(request) - tells if someone is asking a static resource
        Data sirvoRecursoEstatico(req, res) - returns the resource
*/

var fs = require('fs')

function recursoEstatico(request){
    return /\/css\/\w+.css$/.test(request.url) || 
                /\/\w+.svg$/.test(request.url)
}

exports.recursoEstatico = recursoEstatico

function sirvoRecursoEstatico(req, res){
    const file = req.url
    fs.readFile('public/' + file, (erro, dados)=>{
        if(erro){
            console.log('Erro: ficheiro não encontrado ' + erro)
            res.statusCode = 404
            res.end()
        }
        else{
            if(file.endsWith(".svg"))
                res.setHeader('Content-Type', 'image/svg+xml')
            res.end(dados)
        }
    })
}

exports.sirvoRecursoEstatico = sirvoRecursoEstatico