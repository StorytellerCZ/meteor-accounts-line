declare module 'storyteller:accounts-line' {}

declare module 'meteor/meteor' {
  namespace Meteor {
    function loginWithLine(
      options?: Meteor.LoginWithExternalServiceOptions,
      callback?: (error?: Error | Meteor.Error | Meteor.TypedError) => void,
    ): void;
  }
}
