/* global Package */
Package.describe({
  name: 'storyteller:line-config-ui',
  summary: 'Blaze configuration templates for LINE OAuth.',
  version: '1.2.2',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-line'
});

Package.onUse(api => {
  api.versionsFrom(['2.3.6', '3.0']);
  api.use('zodern:types@1.0.13', 'server')
  api.use(['ecmascript', 'typescript'], 'client');
  api.use('templating@1.4.3 || 2.0.0-alpha300.10', 'client');

  api.addFiles('line_login_button.css', 'client');
  api.addFiles(['line_configure.html', 'line_configure.ts'], 'client');
});
