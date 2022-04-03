var express = require('express');
var router = express.Router();
const fs = require('fs')

const fileController = require('../controllers/fileController')

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

/* GET home page. */
router.get(['/','/files'], function(req, res, next) {
  fileController.list().then( value => {
    res.render('files', { title: 'File Collection', files: value});
  }).catch( error => {
    res.render('error', {message: error})
  })
});

router.get('/files/:id', (req, res, next) => {
  fileController.lookup(req.params.id).then( value => {
    res.render('file', { title: value.name, file: value })
  }).catch( error => {
    res.render('error', {message: error})
  })
})

router.get('/files/:id/delete', (req, res, next) => {
  fileController.delete(req.params.id).then( value => {
    res.redirect('/')
  }).catch(error => {
    res.render('error', {message: error})
  })
})

router.get('/file_storage/:id', (req, res, next) => {
  fileController.lookup(req.params.id).then( value => {
    fs.readFile('./file_storage/' + value.name, (err, data) => {
      if (err) throw err
      res.writeHead(200, {'Content-Type': value.mimetype})
      res.write(data)
      res.end()
    })
  }).catch( error => {
    res.render('error', {message: error})
  })
})

router.post('/files', upload.single('myFile'), (req, res, next) => {
  let oldPath = __dirname.slice(0,-6) + '' + req.file.path
  let newPath = __dirname.slice(0,-6) + 'file_storage/' + req.file.originalname

  fs.rename(oldPath, newPath, err => { if (err) throw err; })

  var d = new Date().toISOString().substring(0,16)
  let file = {
    name: req.file.originalname,
    path: newPath,
    size: req.file.size,
    mimetype: req.file.mimetype,
    description: req.body.description,
    date: d
  }
  fileController.insert(file).then( value => {
    res.redirect('/')
  }).catch( error => {
    res.render('error', {message: error})
  })
})

module.exports = router;
