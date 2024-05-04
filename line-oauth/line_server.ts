import { fetch } from 'meteor/fetch'
import { URLSearchParams } from 'meteor/url'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { OAuth } from 'meteor/oauth'
import { Meteor } from 'meteor/meteor'

const jsonwebtoken = Npm.require('jsonwebtoken')
Line = {}

OAuth.registerService('line', 2, null, async (query: { code: string }) => {
  const response = await getAccessToken(query)
  const identity = await getIdentity(response.id_token)
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
  }

  if (identity.email) {
    data.serviceData.email = identity.email
  }

  return data
})

let userAgent = "Meteor"
if (Meteor.release)
  userAgent += '/${Meteor.release}'

const getAccessToken = async (query: { code: string }) => {
  const config = await ServiceConfiguration.configurations.findOneAsync({
    service: 'line'
  })
  if (!config) throw new ServiceConfiguration.ConfigError()
  const content = new URLSearchParams({
    grant_type: 'authorization_code',
    code: query.code,
    client_id: config.channelId,
    client_secret: OAuth.openSecret(config.secret),
    redirect_uri: OAuth._redirectUri('line', config)
  })
  return fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      "User-Agent": userAgent,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: content,
    redirect: 'follow',
    jar: false
  })
    .then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch((err) => {
      throw Object.assign(
        new Error(
          `Failed to complete OAuth handshake with LINE. ${err.message}`
        ),
        {
          response: err.response
        }
      )
    })
}

const getIdentity = async (token: string) => {
  const config = await ServiceConfiguration.configurations.findOneAsync({
    service: 'line'
  })
  if (!config) throw new ServiceConfiguration.ConfigError()
  let response

  let secret = config.secret
  if (typeof secret === 'object' && Package['oauth-encryption']) {
    import { OAuthEncryption } from 'meteor/oauth-encryption'

    secret = OAuthEncryption.open(secret)
  }

  try {
    response = jsonwebtoken.verify(token, secret, {
      audience: config.channelId,
      issuer: 'https://access.line.me',
      algorithms: ['HS256']
      // nonce: // TODO setup and check nonce for additional security
    })
  } catch (err) {
    throw Object.assign(
      new Error(`Couldn't decode JWT from LINE. ${err.message}`),
      {
        response: err.response
      }
    )
  }
  return response
}

Line.retrieveCredential = (credentialToken, credentialSecret) =>
  OAuth.retrieveCredential(credentialToken, credentialSecret)
