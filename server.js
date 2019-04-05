const express = require('express')
const cors = require('cors')
require('dotenv').config();
const {graphqlExpress } = require('apollo-server-express')
const server = require('./data/schema')
const mongoose = require('mongoose')

const PORT = 5000

const app = express()
const dbuser = process.env.MONGODB_USER
const dbpass = process.env.MONGODB_PASSWORD
const dbname = process.env.MONGODB_DBNAME
mongoose.connect(
  'mongodb://' + dbuser + ':' + dbpass + '.mlab.com:63905/' + dbname,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
)
mongoose.connection.once('open', () => {
  console.log('connected to database')
})

app.use(cors())
server.applyMiddleware({ app })
app.listen(PORT, () => {
  if(process.env.NODE_ENV='development')
    console.log(`The GraphQL server is running on http://localhost:${PORT}${server.graphqlPath}`)
  else
    console.log('This is the production server.')
})
