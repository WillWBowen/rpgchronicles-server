const resolvers = require('./resolvers')
const { ApolloServer, gql } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

const typeDefs = gql`
    type Campaign {
      id: String
      user: String
      title: String
      description: String
      sessions: [Session]
    }

    type Session {
      id: String
      user: ID
      title: String
      campaign: Campaign
      description: String
      characters: [Character]
    }

    type Character {
      id: String
      user: String
      name: String
      race: String
      class: String
      sessions: [Session]
    }

    type Query {
      # Read
      campaign(campaign: ID!): Campaign
      campaigns(user: String!): [Campaign]
      character(character: ID!): Character
      characters(user: String!): [Character]
      sessionCharacters(session: ID!): [Character]
      campaignCharacters(campaign: ID!): [Character]
      session(id: ID!): Session
      characterSessions(character: ID!): [Session]
      campaignSessions(campaign: ID!): [Session]

    }

    type Mutation {
      # Create
      addCampaign(input: CreateCampaignInput!): Campaign
      addSession(input: CreateSessionInput): Session
      addCharacter(input: CreateCharacterInput!): Character
      addCharacterSession(character: ID!, session: ID!, user: ID!): Session
      addCampaignSession(campaign: ID!, session: ID!, user: ID!): Session

      # Update
      udpateCampaign(id: ID!, user: ID!, title: String!, description: String!): Campaign
      updateSession(input: UpdateSessionInput!): Session
      updateCharacter(id: ID!, user: ID!, name: String!, age: Int!, race: String!, class: String!): Character

    }

    input CreateCampaignInput {
      user: String!
      title: String!
      description: String!
    }

    input CreateSessionInput {
      user: String!
      title: String!
      campaign: ID!
      description: String!
    }

    input CreateCharacterInput {
      user: String!
      name: String!
      race: String!
      class: String!
    }

    input UpdateSessionInput {
      session: ID!
      user: String!
      title: String!
      campaign: ID!
      description: String!
    }
  `

const client = jwksClient({
  jwksUri: 'https://dndchronicles.auth0.com/.well-known/jwks.json'
})

function getKey(header, cb) {
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey
    cb(null, signingKey)
  })
}

const options = {
  audience: 'nqtzgNYqPvvOos9xWQxn0TSUiKT5s6Qn',
  issuer: `https://dndchronicles.auth0.com/`,
  algorithms: ['RS256']
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization
    const user = new Promise((resolve, reject) => {
      jwt.verify(token, getKey, options, (err, decoded) => {
        if(err) {
          return reject(err)
        }
        resolve(decoded.email)
      })
    })
    return {
      user
    }
  },
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'dark'
    }
  }
})

module.exports = server
