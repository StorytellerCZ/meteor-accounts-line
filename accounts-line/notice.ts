/* @globals Package */
if (
  Package['accounts-ui'] &&
  !Package['service-configuration'] &&
  !Object.prototype.hasOwnProperty.call(Package, 'line-config-ui')
) {
  console.warn(
    "Note: You're using accounts-ui and accounts-line,\n" +
      "but didn't install the configuration UI for LINE\n" +
      'OAuth. You can install it with:\n' +
      '\n' +
      '    meteor add storyteller:line-config-ui' +
      '\n'
  );
}
