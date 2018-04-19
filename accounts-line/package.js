Package.describe({
  name: 'storyteller:accounts-line',
  summary: 'Login service for LINE accounts',
  version: '1.0.0-beta.0',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-line'
});

Package.onUse(api => {
  api.use('ecmascript@0.10.7');
  api.use('accounts-base@1.4.2', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth@1.1.15', ['client', 'server']);
  api.use('storyteller:line-oauth@1.0.0');
  api.imply('storyteller:line-oauth@1.0.0-beta.0');

  // If users use accounts-ui but not facebook-config-ui, give them a tip.
  api.use(['accounts-ui@1.3.0', 'storyteller:wattpad-config-ui@1.0.0'], ['client', 'server'], { weak: true });
  api.addFiles('notice.js');

  api.addFiles('line.js');
});
