const mongoose = require('mongoose')
const Schema = mongoose.Schema

const campaignSchema = new Schema({
  user: String,
  title: String,
  description: String
})

module.exports = mongoose.model('Campaign',campaignSchema)
