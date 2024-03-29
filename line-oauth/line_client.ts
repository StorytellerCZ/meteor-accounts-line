import { ServiceConfiguration } from 'meteor/service-configuration';
import { Random } from 'meteor/random'
import { OAuth } from 'meteor/oauth'

Line = {};
// Request LINE credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Line.requestCredential = (options, credentialRequestCompleteCallback) => {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  const config = ServiceConfiguration.configurations.findOne({ service: 'line' });
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
    return;
  }

  const credentialToken = Random.secret();

  const loginStyle = OAuth._loginStyle('line', config, options);

  const scope = config.scope.join('%20') || 'profile%20oauth';

  let loginUrl =
    'https://access.line.me/oauth2/v2.1/authorize' +
    '?response_type=code' +
    `&client_id=${config.channelId}` +
    `&scope=${scope}` +
    `&redirect_uri=${OAuth._redirectUri('line', config)}` +
    `&state=${OAuth._stateParam(loginStyle, credentialToken, options?.redirectUrl)}`;

  if (options.botPrompt) {
    loginUrl += `&bot_prompt=${options.botPrompt}`
  }

  if (options.uiLocales) {
    loginUrl += `&ui_locales=${options.uiLocales}`
  }

  OAuth.launchLogin({
    loginService: 'line',
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
    popupOptions: {
      height: 500
    }
  });
};
