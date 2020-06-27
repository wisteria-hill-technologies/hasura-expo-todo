import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Auth from './src/Auth';
import Main from './src/Main';
import { ID_TOKEN_KEY } from './config';

interface User {
  id: string,
  name: string,
  isNewUser: boolean
}

export default function App() {
  const [ token, setToken ] = useState(null);
  const [ user, setUser ] = useState<User | null>(null);

  useEffect(() => {
    handleLogin();
  }, []);

  const handleLogin = (isNewUser = false) => {
    SecureStore.getItemAsync(ID_TOKEN_KEY)
      .then(tokenSession => {
        if (tokenSession) {
          const sessionObj = JSON.parse(tokenSession);
          const { exp, token, id, name } = sessionObj || {};
          if ( exp > Math.floor(new Date().getTime() / 1000)) {
            setToken(token);
            setUser({ id, name, isNewUser });
          } else {
            handleLogout();
          }
        }
      });
  };

  const handleLogout = () => {
    setToken(null);
    SecureStore.deleteItemAsync(ID_TOKEN_KEY);
  };

  return (
    <View style={styles.container}>
      {
        token && user && (
          <Main token={token} user={user} />
        )
      }
      <Auth
        token={token}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
