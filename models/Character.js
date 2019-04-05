const mongoose = require('mongoose')
const Schema = mongoose.Schema

const characterSchema = new Schema({
  name: String,
  user: String,
  race: String,
  class: String
})

module.exports = mongoose.model('Character', characterSchema)
