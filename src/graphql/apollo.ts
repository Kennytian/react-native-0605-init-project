import { ApolloClient, InMemoryCache } from '@apollo/client';

const makeApolloClient = (token: string) => {
  const client = new ApolloClient({
    // uri: 'http://localhost:8080/v1/graphql',
    uri: 'http://192.168.50.161:8080/v1/graphql',
    cache: new InMemoryCache(),
  });
  return client;
};

export default makeApolloClient;
