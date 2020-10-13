import React, { Fragment, useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { ApolloProvider, useQuery } from '@apollo/client';
import apolloClient from './apollo';
import { FETCH_PROFILE, FETCH_PROFILE2 } from './profile-data';

interface TVariables {
  id: Number;
  limit: Number;
}

interface TData {
  id: Number;
  name: string;
}

const ProfileList = () => {
  const { data, loading, error } = useQuery<TData, TVariables>(FETCH_PROFILE2, { variables: { id: 0, limit: 10 } });
  if (loading) {
    return <Text>loading</Text>;
  } else if (error) {
    return <Text>error:{JSON.stringify(error)}</Text>;
  }

  return (
    <View>
      {data.profile.map((item: TData, index: number) => {
        return <Text key={index}>* {`${item.id}-${item.name}`}</Text>;
      })}
    </View>
  );
};

const App = () => {
  // ApolloClient<TCache>
  const [client, setClient] = useState();

  const fetchSession = () => {
    const client = apolloClient('');
    setClient(client);
  };

  useEffect(() => {
    fetchSession();
  }, []);

  if (!client) {
    console.log('loading');
    return <Text>loading</Text>;
  }

  // client.query({ query: FETCH_PROFILE }).then(({ data }) => console.log(JSON.stringify(data)));

  return (
    <ApolloProvider client={client}>
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={{ flexDirection: 'column' }}>
            <Text>下面的数据是多graphql里获取的：</Text>
            <ProfileList />
          </View>
        </SafeAreaView>
      </Fragment>
    </ApolloProvider>
  );
};

export default App;
