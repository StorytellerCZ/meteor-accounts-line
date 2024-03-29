import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Line } from 'meteor/storyteller:line-oauth';

Accounts.oauth.registerService('line');

if (Meteor.isClient) {
  // TODO export this function, so that you can access it outside of the Meteor object?
  const loginWithLine = (options, callback) => {
    // support a callback without options
    if (!callback && typeof options === 'function') {
      callback = options;
      options = null;
    }

    const credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Line.requestCredential(options, credentialRequestCompleteCallback);
  };
  Accounts.registerClientLoginFunction('line', loginWithLine);
  Meteor.loginWithLine = (...args) => Accounts.applyLoginFunction('line', args);
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
