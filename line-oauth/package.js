Package.describe({
  name: 'storyteller:line-oauth',
  summary: 'LINE OAuth flow',
  version: '1.0.1',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-line'
});

Npm.depends({
  jsonwebtoken: '8.5.1'
});

Package.onUse(api => {
  api.versionsFrom('1.8.3');
  api.use('ecmascript', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles('line_client.js', 'client');
  api.addFiles('line_server.js', 'server');

  api.export('Line');
});
