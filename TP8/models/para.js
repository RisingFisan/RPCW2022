var mongoose = require('mongoose')

var paraSchema = new mongoose.Schema({
    para: String,
    date: String,
    edited: { type: Boolean, default: false }
})

module.exports = mongoose.model("para", paraSchema)