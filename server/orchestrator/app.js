require("dotenv").config();
const redis = require("./config/redisConnection");

const { ApolloServer } = require("@apollo/server");
const { reportTypeDefs, reportResolvers } = require("./schemas/saferReport");
const { voteTypeDefs, voteResolvers } = require("./schemas/saferVote");
const { startStandaloneServer } = require("@apollo/server/standalone");
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs: [reportTypeDefs, voteTypeDefs],
  resolvers: [reportResolvers, voteResolvers],
  introspection: true,
});

startStandaloneServer(server, {
  listen: {
    port: PORT,
  },

  context: async ({ req }) => {
    // decode token here if available
    try {
      const { access_token } = req.headers;
      return { access_token };
    } catch (error) {
      console.log(error, "<<<");
      throw error;
    }
  },

  context: async ({ req }) => ({
    req,
    access_token: req.headers.access_token || "",
  }),
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
