import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import {ActivityIndicator, View} from "react-native";
import { GRAPHQL_ENDPOINT } from "../config";
import { INSERT_USERS } from '../data/mutations';
import TodoList from './TodoList';


interface Props {
  token: string | null;
  user: { id: string, name: string, isNewUser: boolean } | null;
}

const Main: React.FC<Props> = ({ token, user }) => {
  const [ client, setClient ] = useState<any>(null);
  const { id, name, isNewUser } = user || {};

  useEffect(() => {

    const newClient = new ApolloClient({
      uri: GRAPHQL_ENDPOINT,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setClient(newClient);

  }, []);

  useEffect(() => {
    if(client && isNewUser) {
      client.mutate({
        mutation: INSERT_USERS,
        variables: { id, name }
      });
    }
  }, [client, isNewUser]);

  if(!client) {
    return (
      <ActivityIndicator size="large" color="#0000ff" />
    );
  }

  return (
    <ApolloProvider client={client}>
      <View>
        <TodoList />
      </View>
    </ApolloProvider>
  );
};

Main.propTypes = {
  token: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isNewUser: PropTypes.bool.isRequired
  })
}

export default Main;