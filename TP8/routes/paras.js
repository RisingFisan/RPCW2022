var express = require('express');
var router = express.Router();
var ParaController = require('../controllers/paraController')

router.get('/', function(req, res, next) {
  ParaController.list().then( v => {
    res.status(200).jsonp(v)
  }).catch( e => {
    res.status(500).jsonp({ erro: e })
  })
});

router.get('/:id', function(req, res, next) {
  ParaController.lookup(req.params.id).then( v => {
    res.status(200).jsonp(v)
  }).catch( e => {
    res.status(500).jsonp({ erro: e })
  })
});

router.put('/:id', function(req, res, next) {
  ParaController.update(req.params.id, req.body).then( v => {
    res.status(200).jsonp(v)
  }).catch( e => {
    res.status(500).jsonp({ erro: e })
  })
});


router.post('/', function(req, res, next) {
  ParaController.insert(req.body).then( v => {
    console.log(v)
    res.status(200).jsonp(v)
  }).catch( e => {
    res.status(501).jsonp({ erro: e })
  })
});

router.delete('/:id', function(req, res, next) {
  ParaController.delete(req.params.id).then( v => {
    res.status(200).jsonp(v)
  }).catch( e => {
    res.status(503).jsonp({ erro: e })
  })
})

module.exports = router;
