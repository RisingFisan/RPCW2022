const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(['/', '/musicas'], function(req, res, next) {
  const page_size = 24
  const page = req.query.page ? parseInt(req.query.page) : 1
  const prov = req.query.prov ? req.query.prov : ""
  axios.get("http://localhost:3000/musicas" + (prov != "" ? `?prov=${prov}` : '')).then(resp => {
    const musicas = resp.data.slice(page_size * (page - 1), page_size * page)
    const page_max = Math.ceil(resp.data.length / page_size)
    console.log(page_max)
    res.render('index', { 
      title: "Spotugafy",
      musicas: musicas,
      page: page,
      page_max: page_max,
      prov: prov  
    })
  }).catch( err => {
    res.render('error', {title: "ERROR", message: err})
  })
});

router.get('/musicas/inserir', function(req, res, next) {
  res.render('musica_form', {title: "Nova Música"})
})

router.get('/musicas/:id', function(req, res, next) {
  axios.get('http://localhost:3000/musicas/' + req.params.id).then(resp => {
    const musica = resp.data
    res.render('musica', {musica: musica, title: musica.tit})
  }).catch(err => {
    res.render('error', {title: "ERROR", message: err})
  })
})

router.get('/musicas/:id/delete', function(req, res, next) {
  axios.delete('http://localhost:3000/musicas/' + req.params.id).then(resp => {
    res.redirect('/musicas')
  }).catch(err => {
    res.render('error', {title: "ERROR", message: err})
  })
})

router.post('/musicas', function(req, res, next) {
  const musica = {
    'tit': req.body.tit,
    'musico': req.body.musico,
    'prov': req.body.prov,
    'local': req.body.local,
    'inst': req.body.inst,
    'obs': req.body.obs,
    'file': req.body.file,
    'fileType': req.body.fileType,
    'duracao': req.body.duracao
  }
  axios.post('http://localhost:3000/musicas', musica).then(resp => {
    res.redirect('/musicas')
  }).catch(err => {
    res.render('musica_form', {title: 'Nova Música'})
  })
})

module.exports = router;
