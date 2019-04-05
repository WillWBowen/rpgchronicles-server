const express = require('express')
const cors = require('cors')
require('dotenv').config();
const {graphqlExpress } = require('apollo-server-express')
const server = require('./data/schema')
const mongoose = require('mongoose')

const PORT = 5000

const app = express()

const corsOptions = {
  origin: process.env.ORIGIN,
  redentials: true
}

mongoose.connect(
  `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ds163905.mlab.com:63905/${process.env.MONGODB_DBNAME}`,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
)
mongoose.connection.once('open', () => {
  console.log('connected to database')
})


server.applyMiddleware({ app, cors: corsOptions })
app.listen(PORT, () => {
  if(process.env.NODE_ENV=='development')
    console.log(`The GraphQL server is running on http://localhost:${PORT}${server.graphqlPath}`)
  else
    console.log('This is the production server.')
})
