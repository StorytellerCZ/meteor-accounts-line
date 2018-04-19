Package.describe({
  name: 'storyteller:line-oauth',
  summary: 'LINE OAuth flow',
  version: '1.0.0',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-line'
});

Npm.depends({
  jsonwebtoken: '8.2.1'
});

Package.onUse(api => {
  api.use('ecmascript@0.10.7', ['client', 'server']);
  api.use('oauth2@1.2.0', ['client', 'server']);
  api.use('oauth@1.2.3', ['client', 'server']);
  api.use('http@1.4.1', ['server']);
  api.use('random@1.1.0', 'client');
  api.use('service-configuration@1.0.11', ['client', 'server']);

  api.addFiles('line_client.js', 'client');
  api.addFiles('line_server.js', 'server');

  api.export('Line');
});
