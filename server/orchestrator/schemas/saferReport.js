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

  type LoginResponse {
    access_token: String
  }

  type Report {
    id: ID
    UserId: ID
    User: User
    title: String
    description: String
    TypeId: ID
    Type: Type
    isActive: Boolean
    mainImage: String
    latitude: String
    latitudeDelta: String
    longitude: String
    location: String
    longitudeDelta: String
    createdAt: String
  }

  type Type {
    id: ID
    name: String
  }


  # input ReportInput {
  #   title: String!
  #   description: String!
  #   TypeId: ID
  #   # isActive: Boolean
  #   mainImage: String!
  #   latitude: String!
  #   latitudeDelta: String
  #   longitude: String!

  #   longitudeDelta: String
  #   images: [String!]
  # }

  input UserInput {
    name: String!
    email: String!
    password: String!
    gender: String!
    phoneNumber: String!
    address: String!
  }

  input ReportInput {
    title: String!
    description: String!
    TypeId: ID
    # isActive: Boolean
    mainImage: String!
    latitude: String!
    latitudeDelta: String
    longitude: String!
    longitudeDelta: String
    # images: [String!]
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    gender: String!
    phoneNumber: String!
    address: String!
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    users: [User]
    reports: [Report]
    report(id: ID!): Report
    types: [Type]
  }

  type Mutation {
    createReport(newReport: ReportInput!): Report

    registerUser(newUser: UserInput): User
    loginUser(email: String!, password: String!): String
    createUser(newUser: UserInput): User


    # updateReport(newReport: ReportInput!, id:ID): Report
    # deleteReport(id:ID!): Report
  }
`;

const resolvers = {
  Query: {
    reports: async (_) => {
      try {
        await redis.del("reports");
        const reportCache = await redis.get("reports");
        console.log(reportCache, "ini cache");
        if (reportCache) {
          return JSON.parse(reportCache);
        } else {
          const { data: reports } = await axios.get(
            `${APP_SERVICE_URL}/reports`
          );
          console.log(reports, "ini reporst");
          await redis.set("reports", JSON.stringify(reports));
          return reports;
        }
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        await redis.del("reports");
      }
    },

    report: async (_, args) => {
      try {
        const {
          data: { report },
        } = await axios.get(`${APP_SERVICE_URL}/reports/${args.id}`);

        // const { data: userData } = await axios.get(
        //   `${APP_SERVICE_URL}/users/${report.UserId}`
        // );
        // console.log(userData, "ini data user");

        // report.User = userData;
        // console.log(report.User, ">>>>>>>>>>>>>>>report");
        return report;
      } catch (error) {
        console.log("🚀 ~ file: app.js ~ line 99 ~ item: ~ error", error);
        throw error;
      }
    },

    types: async (_) => {
      try {
        const { data: types } = await axios.get(`${APP_SERVICE_URL}/types`);
        return types;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },

  Mutation: {
    createReport: async (_, args, context) => {
      console.log(context, "<<<<ini con");

      try {
        const { data: report } = await axios.post(
          `${APP_SERVICE_URL}/reports`,
          args.newReport,
          {
            headers: {
              access_token: context.access_token,
            },
          }
        );
        await redis.del("reports");
        return report;
      } catch (error) {
        throw new Error("Failed add report");
      }
    },
    createUser: async (_, args) => {
      try {
        const { name, email, password, gender, phoneNumber, address } =
          args.newUser;
        const admin = {
          name: name,
          email: email,
          password: password,
          gender: gender,
          phoneNumber: phoneNumber,
          address: address,
        };
        const { data } = await axios({
          url: APP_SERVICE_URL + `/register`,
          method: "post",
          data: admin,
        });
        console.log(data);
        redis.del("userCache");
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    registerUser: async (_, args) => {
      try {
        const { data: user } = await axios.post(
          `${APP_SERVICE_URL}/register`,
          args.newUser
        );
        // await redis.del("reports");
        return user;
      } catch (error) {
        console.log(error);
        throw new Error("Failed register user");
      }
    },

    loginUser: async (_, args) => {
      try {
        const { email, password } = args;
        const response = await axios.post(`${APP_SERVICE_URL}/login`, {
          email,
          password,
        });
        console.log(response.data, ">>>>>>>>");
        const result = response.data;
        return JSON.stringify(result);
      } catch (error) {
        throw new Error("Failed login user");
      }
    },
  },
};

module.exports = {
  reportTypeDefs: typeDefs,
  reportResolvers: resolvers,
};
