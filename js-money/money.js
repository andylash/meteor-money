/* global Money:true, module */
/* jshint curly:false, camelcase:false */
"use strict";

/** I've made some fairly significant changes from this library in terms of behavior.
So I don't want David to get the blame if you don't like them.  */

/**
 * This file is part of the JS Money library
 *
 * Copyright (c) 2014 David Kalosi
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Creates a new Money instance.
 * The created Money instances is a value object thus it is immutable.
 *
 * @param {Number} amount
 * @param {Object/String} currency object or currency code
 * @returns {Money}
 * @constructor
 */
Money = function(amount, currency, amountInMinorUnits) {
    var self = this;
    self.currency = currency['toUpperCase'](); //weird javascript type conversion requires this calling form

    var currencyObject = getCurrencyObject(self.currency);

    self.amount = Math.round((amountInMinorUnits) ? amount : amount * getMultiplier(currencyObject));
    Object.freeze(this);
};

var getMultiplier = function(currencyObject) {
    var multipliers = [1, 10, 100, 1000];
    return multipliers[currencyObject.decimal_digits];
};

var getCurrencyObject = function(currency) {
    var currencyObject = Money[currency];
    if (!currencyObject)
        throw new TypeError('Unrecognized currency: ' + currency);
    return currencyObject;
};

var assertSameCurrency = function(left, right) {
    if (left.currency !== right.currency)
        throw new Error('Different currencies');
    return true;
};

var assertType = function(other) {
    other = Money.constructMoneyIfMatching(other);
    if (!(other instanceof Money))
        throw new TypeError('Instance of Money required');
    return true;
};

var validateOperand = function(operand, self) {
    if (operand instanceof Money) {
      assertSameCurrency(self, operand);
      return {
        amount: operand.amount,
        isMoney: true
      };
    } else if (isNaN(parseFloat(operand)) && !isFinite(operand)) {
        throw new TypeError('Operand must be a number');
    }

    return {
        amount: operand,
        isMoney: false
    };
};

var isZero = function(other) {
    return (+other === 0);
};

/**
 * Returns the amount value of the money
 *
 * @returns {Number}
 */
Money.prototype.getAmount = function() {
    var self = this;
    return self.amount / getMultiplier(getCurrencyObject(self.currency));
};

/**
 * Returns the currency code of the money
 *
 * @returns {String}
 */
Money.prototype.getCurrency = function() {
    var self = this;
    return self.currency;
};


/**
 * Returns true if the two instances of Money are equal, false otherwise.
 *
 * @param {Money} other
 * @returns {Boolean}
 */
Money.prototype.equals = function(other) {
    var self = this;
    assertType(other);

    return other && assertType(other) && self.amount === other.amount &&
        self.currency === other.currency;
};

/**
 * Adds the two objects together creating a new Money instance that holds the result of the operation.
 *
 * @param {Money} other
 * @returns {Money}
 */
Money.prototype.add = function(other) {
    var self = this;
    if (isZero(other)) //special case adding 0 number
        return self;

    assertType(other);
    assertSameCurrency(self, other);

    return new Money(self.amount + other.amount, self.currency, true);
};

/**
 * Subtracts the two objects creating a new Money instance that holds the result of the operation.
 *
 * @param {Money} other
 * @returns {Money}
 */
Money.prototype.subtract = function(other) {
    var self = this;
    if (isZero(other)) //special case adding 0 number
        return self;

    assertType(other);
    assertSameCurrency(self, other);

    return new Money(self.amount - other.amount, self.currency, true);
};

/**
 * Multiplies the object by the multiplier returning a new Money instance that holds the result of the operation.
 *
 * @param {Number/Money} multiplier or a Money object
 * @returns {Money}
 */
Money.prototype.multiply = function(multiplier) {
    var self = this;
    var operand = validateOperand(multiplier, self);
    var amount = Math.round(self.amount * operand.amount);
    var currencyMultiplier = getMultiplier(getCurrencyObject(self.currency));
    if (operand.isMoney)
      amount /= currencyMultiplier * currencyMultiplier;

    return new Money(amount, self.currency, !operand.isMoney);
};

/**
 * Divides the object by the multiplier returning a new Money instance that holds the result of the operation.
 *
 * @param {Number}/Money divisor or a Money object
 * @returns {Money}
 */
Money.prototype.divide = function(divisor) {
    var self = this;
    var operand = validateOperand(divisor, self);
    var amount = Math.round(self.amount / operand.amount);

    return new Money(amount, self.currency, !operand.isMoney);
};

/**
 * Allocates fund bases on the ratios provided returing an array of objects as a product of the allocation.
 *
 * @param {Array} other
 * @returns {Array.Money}
 */
Money.prototype.allocate = function(ratios) {
    var self = this;
    var remainder = self.amount;
    var results = [];
    var total = 0;

    ratios.forEach(function(ratio) {
        total += ratio;
    });

    ratios.forEach(function(ratio) {
        var share = Math.floor(self.amount * ratio / total);
        results.push(new Money(share, self.currency, true));
        remainder -= share;
    });

    for (var i = 0; remainder > 0; i++) {
        results[i] = new Money(results[i].amount + 1, results[i].currency, true);
        remainder--;
    }

    return results;
};

/**
 * Compares two instances of Money.
 *
 * @param {Money} other
 * @returns {Number}
 */
Money.prototype.compare = function(other) {
    var self = this;
    assertType(other);
    assertSameCurrency(self, other);

    if (self.amount === other.amount)
        return 0;

    return self.amount > other.amount ? 1 : -1;
};

/**
 * Makes a deep copy of a Money object.
 *
 * @returns {Money}
 */
Money.prototype.clone = function() {
    var self = this;
    return new Money(self.amount, self.currency, true);
};

/**
 * Returns the smallest of the two money objects.
 *
 * @param {Money} other
 * @returns {Money}
 */
Money.prototype.min = function(other) {
    var self = this;
    assertType(other);
    assertSameCurrency(self, other);

    return (self.amount <= other.amount) ? self : other;
};

/**
 * Returns the largest of the two money objects.
 *
 * @param {Money} other
 * @returns {Money}
 */
Money.prototype.max = function(other) {
    var self = this;
    assertType(other);
    assertSameCurrency(self, other);

    return (self.amount >= other.amount) ? self : other;
};

/**
 * Returns true if the input data matches the form of a money object
 *
 * @returns {Boolean}
 */
Money.isUntypedMoney = function(doc) {
  return (! Money.isMoney(doc) && _.isObject(doc) && _.isNumber(doc.amount) && _.isString(doc.currency));
};

/**
 * Construct a new Money object if the input data matches the form of a money object, else it just returns input
 *
 * @returns {Money}
 */
Money.constructMoneyIfMatching = function(doc) {
  if (Money.isUntypedMoney(doc)) {
    return new Money(doc.amount, doc.currency, true);
  }
  return doc;
};

/**
 * Construct a new Money object if the input data matches the form of a money object, else it just returns input
 *
 * @returns {Money}
 */
Money.getCurrencies = function() {
  var currencies = [];
  Object.keys(Money).forEach(function(key) {
      if (typeof Money[key] !== "function")
          currencies.push(Money[key]);
  });
  return currencies;
};

/**
 * Checks if an object is a Money obj
 *
 * @returns {Boolean}
 */
Money.isMoney = function(n) {
  return (n instanceof Money);
};

/**
 * Checks if a currency is legal
 *
 * @returns {Boolean}
 */
Money.validateCurrency = function(currency) {
  try {
    getCurrencyObject(currency);
  }
  catch (error) {
    if (error instanceof TypeError)
      return false;
    throw error;
  }
  return true;
};

if (typeof module === 'object')
    module.exports = Money;
