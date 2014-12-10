/* global FXRates */
"use strict";

Meteor.publish('money-package-fxrates', function() {
  check();
  var self = this;

  if (!self.userId) {
    this.ready();
    return;
  }

  return FXRates.find({}, {
    sort: {
      timestamp: -1
    },
    limit: 1,
  });
});
