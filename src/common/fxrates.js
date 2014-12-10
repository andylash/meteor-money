/* global FXRates:true, fx */
"use strict";

FXRates = new Mongo.Collection('money-package-fxrates');

//disallow all updates
FXRates.deny({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

//fx is the global object that comes from the money.js library
var updateFx = function(doc) {
  console.log("Initialize global fx object with rates from db");
  fx.base = doc.base;
  fx.rates = doc.rates;
  fx.timestamp = doc.timestamp;
};

Meteor.startup(function() {
  //Watch the FXRates collection and update the rates on the global fx object when they change
  FXRates.find({}, {
    sort: {
      timestamp: -1
    },
    limit: 1,
  }).observe({
    addedAt: function(doc) {
      if (!fx.timestamp || fx.timestamp >= doc.timestamp) {
        updateFx(doc);
      }
    },
    changedAt: function(doc) {
      if (!fx.timestamp || fx.timestamp === doc.timestamp) {
        updateFx(doc);
      }
    }
  });
});

