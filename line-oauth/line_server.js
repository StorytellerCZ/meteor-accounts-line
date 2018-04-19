// import { OAuthEncryption } from 'meteor/oauth-encryption';
const jsonwebtoken = Npm.require('jsonwebtoken');
Line = {};

OAuth.registerService('line', 2, null, query => {
  const response = getAccessToken(query);
  const identity = getIdentity(response.id_token);
  let data = {
    serviceData: {
      id: identity.sub,
      authCode: query.code,
      accessToken: response.access_token,
      expires: response.expires_in,
      refreshToken: response.refresh_token
    },
    options: { profile: { name: identity.name, avatar: identity.picture } }
  };

  if (identity.email) {
    data.serviceData.email = identity.email;
  }

  return data;
});

const getAccessToken = query => {
  const config = ServiceConfiguration.configurations.findOne({ service: 'line' });
  if (!config) throw new ServiceConfiguration.ConfigError();
  let response;
  try {
    response = HTTP.post('https://api.line.me/oauth2/v2.1/token?grant_type=authorization_code', {
      headers: { Accept: 'application/json' },
      params: {
        code: query.code,
        client_id: config.channelId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: OAuth._redirectUri('line', config)
      }
    });
  } catch (err) {
    throw Object.assign(new Error(`Failed to complete OAuth handshake with LINE. ${err.message}`), {
      response: err.response
    });
  }

  if (response.error) {
    // if the http response was a json object with an error attribute
    throw new Error(`Failed to complete OAuth handshake with LINE. ${response.error_description}`);
  } else {
    return response.data;
  }
};

const getIdentity = token => {
  const config = ServiceConfiguration.configurations.findOne({ service: 'line' });
  if (!config) throw new ServiceConfiguration.ConfigError();
  let response;

  // TODO: figure a better way, make jsonwebtoken do the work
  let secret = config.secret;
  if (typeof secret === 'object' && Package['oauth-encryption']) {
    secret = OAuthEncryption.open(secret);
  }

  try {
    response = jsonwebtoken.verify(token, secret, {
      audience: config.channelId,
      issuer: 'https://access.line.me',
      algorithms: ['HS256']
    });
    // TODO setup and check nonce for additional security
  } catch (err) {
    throw Object.assign(new Error(`Couldn't decode JWT from LINE. ${err.message}`), {
      response: err.response
    });
  }
  return response;
};

Line.retrieveCredential = (credentialToken, credentialSecret) =>
  OAuth.retrieveCredential(credentialToken, credentialSecret);
