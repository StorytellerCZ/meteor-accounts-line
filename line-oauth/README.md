# line-oauth

An implementation of the [LINE](https://line.me) OAuth flow. See the [Meteor Guide](https://guide.meteor.com/accounts.html) for more details.

## Configuration
Sample configuration on your server:
```javascript
ServiceConfiguration.configurations.upsert(
  { service: 'line' },
  {
    $set: {
      loginStyle: 'popup',
      scope: ['profile', 'openid', 'email'],
      channelId: Meteor.settings.packages?.services?.line?.channelId,
      secret: Meteor.settings.packages?.services?.line?.secret
    }
  }
)
```

OR via settings json:

```json
{
  "packages": {
    "service-configuration": {
      "line": {
        "loginStyle": "popup",
        "scope": ["profile", "openid", "email"],
        "channelId": "youChannelId",
        "secret": "yourSecretCode"
      }
    }
  }
}
```

#### loginStyle
Login style, either `popup` or `redirect`. `popup` is the recommended method.

#### scope
What information you want to request from LINE. More details at [LINE documentation](https://developers.line.biz/en/docs/line-login/integrate-line-login/#scopes) 

#### channelId
Your channel ID from LINE Developer's console.

#### secret
Your app secret from LINE Developer's console.


## Options (client-side)
#### loginStyle
You can override the login style.

#### botPrompt
Set this if you want to show to the user on login the option to add your channel to their friends. More at [LINE documentation](https://developers.line.biz/en/docs/line-login/link-a-bot/).

#### uiLocales
Display language for LINE Login screens. Specify as one or more [RFC 5646 (BCP 47)](https://tools.ietf.org/html/rfc5646) language tags, separated by spaces, in order of preference. Corresponds to the ui_locales parameter defined in the "Authentication Request" section of [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html).

## Calling login
Like with all other Meteor logins, you can call the LINE login with `Meteor.loginWithLine` to which you pass options and callback method:

```typescript
Meteor.loginWithLine(
  { loginStyle: 'popup', botPrompt: 'normal' },
  (error) => {
    if (error) {/* handle error */}
    if (!error) {/* user is loged in, redirect to their dashboard or other action */}
  }
)
```

## Integrations
### Meteor Link Accounts
This package is part of [bozhao:link-accounts](https://atmospherejs.com/bozhao/link-accounts) package that allows you to link multiple login accounts for your account.
