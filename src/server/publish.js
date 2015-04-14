/* global FXRates */
"use strict";

Meteor.publish('money-package-fxrates', function() {
  check();
  var self = this;

  if (!self.userId) {
    this.ready();
    return;
  }

  if (this.unblock) //if meteorhacks:unblock is installed, let's use it
    this.unblock();

  return FXRates.find({}, {
    sort: {
      timestamp: -1
    },
    limit: 1,
  });
});
