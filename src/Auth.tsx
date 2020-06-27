import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Alert
} from "react-native";
import * as AuthSession from 'expo-auth-session';
import * as Random from 'expo-random';
import * as SecureStore from 'expo-secure-store';
import jwtDecoder from 'jwt-decode';
import queryString from 'query-string';
import {
  AUTH_CLIENT_ID,
  AUTH_DOMAIN,
  AUTH_NAMESPACE,
  ID_TOKEN_KEY,
  NONCE_KEY
} from '../config';

const generateNonce = async () => {
  // nonce - number used once
  const randomBytes = await Random.getRandomBytesAsync(16);

  const nonce = String.fromCharCode.apply(
    null,
    Array.from(randomBytes)
  );
  return nonce;
};

interface Props {
  token: string | null;
  onLogin: (isNewUser: boolean) => void;
  onLogout: () => void;
}
const Auth: React.FC<Props> = ({ token, onLogin, onLogout }) => {

  const handleLoginPress = async () => {
    const nonce = await generateNonce();
    await SecureStore.setItemAsync(NONCE_KEY, nonce);

    AuthSession.startAsync({
      authUrl:
        `${AUTH_DOMAIN}/authorize?` +
        queryString.stringify({
          client_id: AUTH_CLIENT_ID,
          response_type: "id_token",  //tells it that I want id_token in response.
          scope: "openid profile email",  //this let me customise that the data I get back from the response.
          redirect_uri: AuthSession.getRedirectUrl(),
          nonce
        })
    }).then((result) => {
      if (result.type === "success") {
        decodeAndStoreTokenSession(result.params.id_token);
      } else if (result.type == "error" && result.params.error) {
        Alert.alert(
          "Error",
          result.params.error_description ||
          "Something went wrong while logging in."
        );
      }
    });
  };

  const decodeAndStoreTokenSession = (token: string) => {
    const decodedToken: any = jwtDecoder(token);
    const {nonce, sub, email, name, exp} = decodedToken;

    SecureStore.getItemAsync(NONCE_KEY).then(storedNonce => {
      if (nonce == storedNonce) {
        SecureStore.setItemAsync(
          ID_TOKEN_KEY,
          JSON.stringify({
            id: sub,
            email,
            name,
            exp,
            token
          })
        ).then(() => {
          onLogin(decodedToken[AUTH_NAMESPACE].isNewUser);
        });
      } else {
        Alert.alert("Error", "Nonces don't match");
        return;
      }
    });
  };

  return token ? (
    <Button title="Logout" onPress={onLogout} />
  ) : (
    <Button title="Login" onPress={handleLoginPress} />
  );
};

Auth.propTypes = {
  token: PropTypes.string,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Auth;