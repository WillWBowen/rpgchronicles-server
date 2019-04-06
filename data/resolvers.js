const Character = require('../models/Character')
const Campaign = require('../models/Campaign')
const Session = require('../models/Session')
const { AuthenticationError } = require('apollo-server-express')

const books = []

const resolvers = {
    Query: {
      async characters(_, {user}) { return await Character.find({user: user}) },
      async character(_, {character}) { return await Character.findById(character)},
      async campaigns(_, {user}) { return await Campaign.find({user: user}) },
      async campaign(_, {campaign}) { return await Campaign.findById(campaign) },
      async campaignSessions(_, {campaign}) { return await Session.find({campaign: campaign}) }
    },
    Mutation: {
      async addCharacter(_, { input }, { user }) {
        try {
          const email = await user
          const character = new Character(input)
          return await character.save()
        } catch(e) {
          throw new AuthenticationError('You must be logged in to do this')
        }
      },
      async addCampaign(_, {input}, {user}) {
        try {
          const email = await user
          const campaign = new Campaign(input)
          return await campaign.save()
        } catch(e) {
          throw new AuthenticationError('You must be logged in to do this')
        }
      },
      async addSession(_, {input}, {user}) {
        try {
          const email = await user
          const session = new Session(input)
          return await session.save()
        } catch(e) {
          console.log(e)
          throw new AuthenticationError('You must be logged in to do this')
        }
      },
      async updateSession(_, {input}, {user}) {
        try {
          const email = await user
          console.log(email)
          return await Session.findByIdAndUpdate(input.session, input)
        } catch(e) {
          console.log(e)
          throw new AuthenticationError('You must be logged in to do this')
        }
      },

      async deleteCharacter(_, {character}, {user}) {
        try {
          const email = await user
          return await Character.findByIdAndRemove(character)
        } catch(e) {
          console.log(e)
          throw new AuthenticationError('You must be logged in to do this')
        }
      }
    },
    Campaign: {
      async sessions(campaign) {return await Session.find({campaign: campaign.id})}
    },
    Session: {
      async campaign(session) { return await Campaign.findById(session.campaign) }
    }
  };

module.exports = resolvers
