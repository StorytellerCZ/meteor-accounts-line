import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.configureLoginServiceDialogForLine.helpers({
  siteUrl: () => Meteor.absoluteUrl()
});

Template.configureLoginServiceDialogForLine.fields = () => [
  { property: 'channelId', label: 'Channel ID' },
  { property: 'secret', label: 'Channel Secret' }
];
