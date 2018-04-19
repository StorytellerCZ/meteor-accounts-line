const jsonwebtoken = Npm.require('jsonwebtoken');
Line = {};

OAuth.registerService('line', 2, null, query => {
  console.dir(query);
  const response = getAccessToken(query);
  console.dir(response);
  const identity = getIdentity(response.id_token);
  console.dir(identity);
  return {
    serviceData: {
      id: identity.sub,
      authCode: query.code,
      accessToken: response.access_token,
      expires: response.expires_in,
      refreshToken: response.refresh_token
    },
    options: { profile: { name: identity.name, avatar: identity.picture, email: identity.email } }
  };
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
        clientId: config.channelId,
        clientSecret: OAuth.openSecret(config.secret),
        redirectUri: OAuth._redirectUri('line', config)
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

const getIdentity = query => {
  const config = ServiceConfiguration.configurations.findOne({ service: 'line' });
  if (!config) throw new ServiceConfiguration.ConfigError();
  let response;

  try {
    response = jsonwebtoken.verify(query.id_token,
                                    config.secret,
                                    {
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
