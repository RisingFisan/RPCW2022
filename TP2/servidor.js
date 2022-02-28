const http = require('http')
const fs = require('fs')

http.createServer(function (req, res) {
    //console.log(req.url)
    if (req.url.endsWith(".css")) {
        fs.readFile('./' + req.url.split('/').slice(-1), function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'})
            if (err) res.write("<p>Erro na leitura do ficheiro...</p>")
            else res.write(data)
            res.end()
        })
        return
    }
    if (req.url.endsWith(".png")) {
        fs.readFile('./' + req.url.split('/').slice(-1), function (err, data) {
            res.writeHead(200, {'Content-Type': 'image/png; charset=utf-8'})
            if (err) res.write("<p>Erro na leitura do ficheiro...</p>")
            else res.write(data)
            res.end()
        })
        return
    }
    if(req.url == "/") {
        fs.readFile('./index.html', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            if (err) res.write("<p>Erro na leitura do ficheiro...</p>")
            else res.write(data)
            res.end()
        })
        return
    }

    const parsedUrl = /\/(filmes|atores)(?:\/((?:f|a)\d+))?/.exec(req.url)
    if (!parsedUrl) {
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
        res.end("<p>Error 404 - page not found</p>")
    }
    else {
        let pag, subPag;
        [,pag,subPag] = parsedUrl
        fs.readFile('./' + pag + '/' + (subPag ? subPag : 'index') + '.html', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            if (err) res.write("<p>Erro na leitura do ficheiro...</p>")
            else res.write(data)
            res.end()
        })
    }
}).listen(7777, function () {
    console.log("Servidor à escuta na porta 7777...")
})