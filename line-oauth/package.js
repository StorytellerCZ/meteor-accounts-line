Package.describe({
  name: 'storyteller:line-oauth',
  summary: 'LINE OAuth flow',
  version: '1.2.1',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-line'
});

Npm.depends({
  jsonwebtoken: '8.5.1'
});

Package.onUse(api => {
  api.versionsFrom('1.9');
  api.use('ecmascript', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use(['fetch', 'url'], 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles('line_client.js', 'client');
  api.addFiles('line_server.js', 'server');

  api.export('Line');
});
