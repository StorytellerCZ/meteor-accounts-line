import { Meteor } from 'meteor/meteor';
import { fetch, URLSearchParams } from 'meteor/fetch';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { OAuth } from 'meteor/oauth'
const jsonwebtoken = Npm.require('jsonwebtoken');
Line = {};

OAuth.registerService('line', 2, null, async (query) => {
  const responseFunc = await getAccessToken(query);
  const response = responseFunc(query);
  const identity = getIdentity(response.id_token);
  let data = {
    serviceData: {
      id: identity.sub,
      authCode: query.code,
      accessToken: response.access_token,
      expires: response.expires_in,
      refreshToken: response.refresh_token,
      scope: response.scope,
      tokenType: response.token_type
    },
    options: { profile: { name: identity.name, avatar: identity.picture } }
  };

  if (identity.email) {
    data.serviceData.email = identity.email;
  }

  return data;
});

const getAccessToken = async (query) => {
  const config = ServiceConfiguration.configurations.findOne({ service: 'line' });
  if (!config) throw new ServiceConfiguration.ConfigError();
  let request;
  try {
    const content = new URLSearchParams({
      grant_type: 'authorization_code',
      code: query.code,
      client_id: config.channelId,
      client_secret: OAuth.openSecret(config.secret),
      redirect_uri: OAuth._redirectUri('line', config)
    });
    request = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: content,
      redirect: 'follow',
      jar: false
    });
  } catch (err) {
    throw Object.assign(new Error(`Failed to complete OAuth handshake with LINE. ${err.message}`), {
      response: err.response
    });
  }

  const response = await request.json();

  if (response.error) {
    // if the response was a json object with an error attribute
    throw new Error(`Failed to complete OAuth handshake with LINE. ${response.error_description}`);
  } else {
    return response
  }
};

const getIdentity = token => {
  const config = ServiceConfiguration.configurations.findOne({ service: 'line' });
  if (!config) throw new ServiceConfiguration.ConfigError();
  let response;

  let secret = config.secret;
  if (typeof secret === 'object' && Package['oauth-encryption']) {
    import { OAuthEncryption } from 'meteor/oauth-encryption';

    secret = OAuthEncryption.open(secret);
  }

  try {
    response = jsonwebtoken.verify(token, secret, {
      audience: config.channelId,
      issuer: 'https://access.line.me',
      algorithms: ['HS256'],
      // nonce: // TODO setup and check nonce for additional security
    });
  } catch (err) {
    throw Object.assign(new Error(`Couldn't decode JWT from LINE. ${err.message}`), {
      response: err.response
    });
  }
  return response;
};

Line.retrieveCredential = (credentialToken, credentialSecret) =>
  OAuth.retrieveCredential(credentialToken, credentialSecret);
