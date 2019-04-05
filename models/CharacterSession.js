const mongoose = require('mongoose')
const Schema = mongoose.Schema

const characterSessionSchema = new Schema({
  user_id: String,
  character_id: String,
  session_di: String
})

module.exports = mongoose.model('CharacterSession', characterSessionSchema)
