Accounts.oauth.registerService('line');

if (Meteor.isClient) {
  const loginWithWattpad = (options, callback) => {
    // support a callback without options
    if (!callback && typeof options === 'function') {
      callback = options;
      options = null;
    }

    const credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Wattpad.requestCredential(options, credentialRequestCompleteCallback);
  };
  Accounts.registerClientLoginFunction('line', loginWithWattpad);
  Meteor.loginWithWattpad = (...args) => Accounts.applyLoginFunction('line', args);
} else {
  Accounts.addAutopublishFields({
    // publish all fields including access token, which can legitimately
    // be used from the client (if transmitted over ssl or on
    // localhost). https://developers.facebook.com/docs/concepts/login/access-tokens-and-types/,
    // "Sharing of Access Tokens"
    forLoggedInUser: ['services.line'],
    forOtherUsers: ['services.line.id', 'services.line.username']
  });
}
