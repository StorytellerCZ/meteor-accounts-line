import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.configureLoginServiceDialogForWattpad.helpers({
  siteUrl: () => Meteor.absoluteUrl()
});

Template.configureLoginServiceDialogForWattpad.fields = () => [
  { property: 'channelId', label: 'Channel ID' },
  { property: 'secret', label: 'Channel Secret' }
];
