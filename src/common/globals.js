/* global Money:true, fx:true, FXRates:true, FXRatesHelper:true */
/* eslint strict:0 */
FXRates = {};
FXRatesHelper = {};
if (Meteor.isServer) {
  Money = Npm.require('money-core');
  fx = Npm.require("money");
}
