var mongoose = require('mongoose')

var Para = require('../models/para')

module.exports.list = () => {
    return Para.find().sort({date: 1}).exec()
}

module.exports.lookup = (id) => {
    return Para.findById(id).exec()
}

module.exports.update = (id, newEntry) => {
    return Para.findOneAndReplace({_id: id}, newEntry).exec()
}

module.exports.delete = (id) => {
    return Para.findByIdAndDelete(id).exec()
}

module.exports.insert = (p) => {
    var d = new Date()
    p.date = d.toISOString()
    var newPara = new Para(p)
    return newPara.save()
}