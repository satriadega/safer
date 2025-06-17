import { ApolloClient, InMemoryCache } from "@apollo/client";
import { API_URL } from "./api";

const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: "no-cache",
  //     errorPolicy: "ignore",
  //   },
  //   query: {
  //     fetchPolicy: "no-cache",
  //     errorPolicy: "all",
  //   },
  // },
});

export default client;
