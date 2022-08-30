import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const authLink = setContext(async (_, { headers }) => {
  const token = await localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      "x-api-key": token || "",
    },
  };
});

const httpLink = createHttpLink({
  uri: "https://fifa-players-graphql.herokuapp.com/",
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
