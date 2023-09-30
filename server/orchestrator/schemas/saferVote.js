const axios = require("axios");
const APP_SERVICE_URL = process.env.APP_SERVICE_URL || "http://localhost:3000";
const redis = require("../config/redisConnection");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    id: ID
    name: String
    email: String
    password: String
    gender: String
    phoneNumber: String
    address: String
  }

  type Report {
    id: ID
    UserId: ID
    user: User
    title: String
    description: String
    type: String
    isActive: Boolean
    mainImage: String
    latitude: String
    latitudeDelta: String
    longitude: String
    longitudeDelta: String
  }


  type LoginResponse {
    access_token: String
  }

  type Vote {
    id: ID
    UserId: ID
    User: User
    ReportId: ID
    Report: Report
    image: String
    status: String
    comment: String
  }

  input VoteInput {
    id: ID
    status: String!
    comment: String!
    ReportId: ID!
    # image: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    users: [User]
    reports: [Report]
    votes: [Vote]
    vote(id: ID!): Vote
    voteByReport(id: ID!): [Vote]
  }

  type Mutation {
    createVote(newVote: VoteInput!): Vote
    editVote(newVote: VoteInput!): Vote



    # updateReport(newReport: ReportInput!, id:ID): Report
    # deleteReport(id:ID!): Report
  }
`;

const resolvers = {
  Query: {
    votes: async (_) => {
      try {
        await redis.del("votes");
        const votesCache = await redis.get("votes");
        console.log(votesCache, "ini cache");
        if (votesCache) {
          return JSON.parse(votesCache);
        } else {
          const { data: votes } = await axios.get(`${APP_SERVICE_URL}/votes`);
          console.log(votes.result, "ini repors");
          await redis.set("votes", JSON.stringify(votes));
          return votes.result;
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    vote: async (_, args, context) => {
      try {
        // console.log(context.access_token, "accessss");
        const {
          data: { vote },
        } = await axios.get(`${APP_SERVICE_URL}/votes/${args.id}`, {
          headers: {
            access_token: context.access_token,
          },
        });
        console.log(vote);

        const { data: userData } = await axios.get(
          `${APP_SERVICE_URL}/users/${vote.UserId}`
        );
        // console.log(userData, "ini data user");

        vote.User = userData;
        // console.log(vote);
        return vote;
      } catch (error) {
        // console.log("🚀 ~ file: app.js ~ line 99 ~ item: ~ error", error);
        throw error;
      }
    },

    voteByReport: async (_, args) => {
      try {
        const { data: voteByReport } = await axios.get(
          `${APP_SERVICE_URL}/votes/${args.id}`
        );
        console.log("voteByReport", voteByReport);
        return voteByReport;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },

  Mutation: {
    createVote: async (_, args, context) => {
      // console.log(context, "<<<<ini con");
      try {
        const { data: vote } = await axios.post(
          `${APP_SERVICE_URL}/votes`,
          args.newVote,
          {
            headers: {
              access_token: context.access_token,
            },
          }
        );
        await redis.del("votes");
        return vote;
      } catch (error) {
        throw new Error("Failed add report");
      }
    },

    editVote: async (_, args, context) => {
      // console.log(args);
      console.log(context, "<<<<ini con");
      try {
        const { id, ...updatedVoteData } = args.newVote;
        console.log(id);
        const { data: vote } = await axios.put(
          `${APP_SERVICE_URL}/votes/${id}`,
          updatedVoteData,
          {
            headers: {
              access_token: context.access_token,
            },
          }
        );
        // await redis.del("votes");
        return vote;
      } catch (error) {
        console.log(error);
        throw new Error("Failed edit vote");
      }
    },
  },
};

module.exports = {
  voteTypeDefs: typeDefs,
  voteResolvers: resolvers,
};
