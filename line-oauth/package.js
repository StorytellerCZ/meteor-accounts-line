/* global Package */
Package.describe({
  name: 'storyteller:line-oauth',
  summary: 'LINE OAuth flow',
  version: '1.4.1-alpha.1',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-line'
});

Npm.depends({
  jsonwebtoken: '8.5.1'
});

Package.onUse(api => {
  api.versionsFrom(['2.9.0', '3.0-alpha.11']);
  api.use('zodern:types@1.0.9', 'server')
  api.use(['ecmascript', 'typescript'], ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use(['fetch', 'url'], 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles('line_client.ts', 'client');
  api.addFiles('line_server.ts', 'server');

  api.export('Line');
});
