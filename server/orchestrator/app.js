require("dotenv").config();
const redis = require("./config/redisConnection");

const { ApolloServer } = require("@apollo/server");
const { reportTypeDefs, reportResolvers } = require("./schemas/saferReport");
const { voteTypeDefs, voteResolvers } = require("./schemas/saferVote");
const { startStandaloneServer } = require("@apollo/server/standalone");
const PORT = process.env.PORT || 4000;
const { formatError } = require("./utils/errorHandler");

const server = new ApolloServer({
  typeDefs: [reportTypeDefs, voteTypeDefs],
  resolvers: [reportResolvers, voteResolvers],
  introspection: true,
  formatError: formatError,
});

startStandaloneServer(server, {
  listen: {
    port: PORT,
  },

  context: async ({ req }) => {
    // decode token here if available
    try {
      const access_token = req.headers.access_token || null;

      return { access_token };
    } catch (error) {
      console.log(error, "<<<");
      throw error;
    }
  },
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch(console.log);
