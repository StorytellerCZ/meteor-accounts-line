Package.describe({
  name: 'storyteller:line-config-ui',
  summary: 'Blaze configuration templates for LINE OAuth.',
  version: '1.1.0',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-line'
});

Package.onUse(api => {
  api.versionsFrom('1.9');
  api.use('ecmascript', 'client');
  api.use('templating@1.3.2', 'client');

  api.addFiles('line_login_button.css', 'client');
  api.addFiles(['line_configure.html', 'line_configure.js'], 'client');
});
