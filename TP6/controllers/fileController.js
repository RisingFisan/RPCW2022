const mongoose = require('mongoose')
const fs = require('fs')

const File = require('../models/file')

exports.list = () => {
    return File.find().exec()
}

exports.lookup = id => {
    return File.findById(id).exec()
}

exports.insert = file => {
    let f = new File(file)
    return f.save()
}

exports.delete = id => {
    return File.findById(id).exec().then( value => {
        return fs.unlink(value.path, err => {
            if (err) throw err
            return File.findByIdAndDelete( id ).exec()
        })
    }).catch(error => {
        console.log(error)
    })
}