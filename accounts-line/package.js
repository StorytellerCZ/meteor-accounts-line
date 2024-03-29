/* global Package */
Package.describe({
  name: 'storyteller:accounts-line',
  summary: 'Login service for LINE accounts',
  version: '1.3.2-alpha.1',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-line'
});

Package.onUse(api => {
  api.versionsFrom(['2.3.6', '2.9.0', '3.0-alpha.11']);
  api.use(['ecmascript', 'typescript']);
  api.use('zodern:types@1.0.9')
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('storyteller:line-oauth@1.4.0');
  api.imply('storyteller:line-oauth');

  // If users use accounts-ui but not facebook-config-ui, give them a tip.
  api.use(['accounts-ui', 'storyteller:line-config-ui@1.2.0'], ['client', 'server'], { weak: true });
  api.addFiles('notice.ts');

  api.addFiles('line.ts');

  api.export('Line')
});
