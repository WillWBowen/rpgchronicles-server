const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessionSchema = new Schema({
  campaign: String,
  title: String,
  description: String,
  user: String
})

module.exports = mongoose.model('Session', sessionSchema)
