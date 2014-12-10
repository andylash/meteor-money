/* global Money */
"use strict";


var MONEY_TYPE_NAME = 'Money';
Money.prototype.typeName = function() {
  return MONEY_TYPE_NAME;
};

EJSON.addType(MONEY_TYPE_NAME, function(m) {
  return new Money(m.amount, m.currency, true);
});

Money.prototype.toJSONValue = function() {
  return {
    amount: this.amount,
    currency: this.currency
  };
};
