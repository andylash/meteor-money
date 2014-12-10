/* global Money:true, describe, it, chai, fx */
/* jshint curly:false, camelcase:false */
"use strict";

//base data for tests
fx.base = "USD";
fx.rates = {
  "EUR" : 0.5, // eg. 1 USD === 0.5 EUR
  "GBP" : 2,
};

var expect = chai.expect;

describe('MoneyConversions', function () {

    it('should convert the currency', function () {
        var first = new Money(1000, 'USD');
        var second = first.convert('EUR');

        expect(second.getAmount()).to.equal(500);
        expect(second.getCurrency()).to.equal('EUR');
    });

    it('should do nothing if converting to same currency', function () {
        var first = new Money(1000, 'USD');
        var second = first.convert('USD');

        expect(second.getAmount()).to.equal(1000);
        expect(second.getCurrency()).to.equal('USD');
    });

    it('should add same currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'EUR');

        var result = first.addC(second);

        expect(result.getAmount()).to.equal(1500);
        expect(result.currency).to.equal('EUR');

        expect(first.getAmount()).to.equal(1000);
        expect(second.getAmount()).to.equal(500);
    });

    it('should add different currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'USD');

        var result = first.addC(second);

        expect(result.getAmount()).to.equal(1250);
        expect(result.currency).to.equal('EUR');
    });

    it('should subtract same currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'EUR');

        var result = first.subtractC(second);

        expect(result.getAmount()).to.equal(500);
        expect(result.currency).to.equal('EUR');
    });

    it('should subtract different currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'USD');

        var result = first.subtractC(second);

        expect(result.getAmount()).to.equal(750);
        expect(result.currency).to.equal('EUR');
    });

    it('should return exchange rate', function () {
        var rate = Money.getCurrentExchangeRate('USD', 'EUR');
        expect(rate.rate).to.equal(0.5);

        var rate2 = Money.getCurrentExchangeRate('EUR', 'USD');
        expect(rate2.rate).to.equal(2);

    });

});
