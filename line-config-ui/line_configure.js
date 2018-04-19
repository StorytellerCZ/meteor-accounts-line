Template.configureLoginServiceDialogForWattpad.helpers({
  siteUrl: () => Meteor.absoluteUrl()
});

Template.configureLoginServiceDialogForWattpad.fields = () => [
  { property: 'channelId', label: 'Channel ID' },
  { property: 'secret', label: 'Channel Secret' }
];
