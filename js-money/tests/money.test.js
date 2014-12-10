/* global Money:true, describe, it, chai */
/* jshint curly:false, camelcase:false */
"use strict";
/**
 * This file is part of the JS Money library
 *
 * Copyright (c) 2014 David Kalosi
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */



var expect = chai.expect;

describe('Money', function () {

    it('should create a new instance from integer', function () {
        var money = new Money(1000, 'EUR');

        expect(money.amount).to.equal(100000);
        expect(money.getAmount()).to.equal(1000);
        expect(money.getCurrency()).to.equal('EUR');
    });

    it('should create a new instance from decimal', function () {
        var money = new Money(10.42, 'EUR');

        expect(money.amount).to.equal(1042);
        expect(money.getAmount()).to.equal(10.42);
        expect(money.getCurrency()).to.equal('EUR');
    });

    it('should create a new instance from integer 10 smaller', function () {
        var money = new Money(1000, 'EUR', true);

        expect(money.amount).to.equal(1000);
        expect(money.getAmount()).to.equal(10);
        expect(money.getCurrency()).to.equal('EUR');
    });


    it('should detect invalid currency', function () {
        expect(function () {
            new Money(10, 'XYZ');
        }).to.throw(TypeError);
    });

    it('should serialize correctly', function() {
        var money = new Money(10.42, 'EUR');

        expect(money.amount).to.be.a.number;
        expect(money.currency).to.be.a.string;
    });

    it('should check for decimal precision', function() {
        var money = new Money(10.423434, 'EUR');
        expect(money.amount).to.equal(1042);
        expect(money.getAmount()).to.equal(10.42);
    });

    it('should add same currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'EUR');

        var result = first.add(second);

        expect(result.getAmount()).to.equal(1500);
        expect(result.currency).to.equal('EUR');

        expect(first.getAmount()).to.equal(1000);
        expect(second.getAmount()).to.equal(500);
    });

    it('should not add different currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'USD');

        expect(first.add.bind(first, second)).to.throw(Error);
    });

    it('should allow adding zero', function () {
        var first = new Money(1000, 'EUR');
        var second = 0;

        var result = first.add(second);

        expect(result.getAmount()).to.equal(1000);
        expect(result.currency).to.equal('EUR');

        expect(first.getAmount()).to.equal(1000);
    });

    it('should not allow adding other integers', function () {
        var first = new Money(1000, 'EUR');
        var second = 10;

        expect(first.add.bind(first, second)).to.throw(Error);
    });


    it('should check for same type', function () {
        var first = new Money(1000, 'EUR');

        expect(first.add.bind(first, {})).to.throw(TypeError);
    });

    it('should check if equal', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(1000, 'EUR');
        var third = new Money(1000, 'USD');
        var fourth = new Money(100, 'EUR');

        expect(first.equals(second)).to.equal(true);
        expect(first.equals(third)).to.equal(false);
        expect(first.equals(fourth)).to.equal(false);
    });

    it('should compare correctly', function () {
        var subject = new Money(1000, 'EUR');

        expect(subject.compare(new Money(1500, 'EUR'))).to.equal(-1);
        expect(subject.compare(new Money(500, 'EUR'))).to.equal(1);
        expect(subject.compare(new Money(1000, 'EUR'))).to.equal(0);
    });

    it('should subtract same currencies correctly', function() {
        var subject = new Money(1000, 'EUR');
        var result = subject.subtract(new Money(250, 'EUR'));

        expect(result.getAmount()).to.equal(750);
        expect(result.currency).to.equal('EUR');
    });

    it('should allow subtracting zero', function () {
        var first = new Money(1000, 'EUR');
        var second = 0;

        var result = first.subtract(second);

        expect(result.getAmount()).to.equal(1000);
        expect(result.currency).to.equal('EUR');

        expect(first.getAmount()).to.equal(1000);
    });

    it('should not allow subtracting other integers', function () {
        var first = new Money(1000, 'EUR');
        var second = 10;

        expect(first.subtract.bind(first, second)).to.throw(Error);
    });

    it('should multiply correctly', function() {
        var subject = new Money(1000, 'EUR');
        var result = subject.multiply(10.5);

        expect(result.getAmount()).to.equal(10500);
    });

    it('should multiply correctly if operand is same currency', function() {
        var subject = new Money(1000, 'EUR');
        var result = subject.multiply(new Money(10, 'EUR'));

        expect(result.getAmount()).to.equal(10000);
    });

      it('should not allow multiply by other currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(10, 'USD');

        expect(first.multiply.bind(first, second)).to.throw(Error);
    });


    it('should divide correctly', function() {
        var subject = new Money(1000, 'EUR');
        var result = subject.divide(2.234);

        expect(result.getAmount()).to.equal(447.63);
    });

    it('should divide correctly if operand is same currency', function() {
        var subject = new Money(1000, 'EUR');
        var result = subject.divide(new Money(10, 'EUR'));

        expect(result.getAmount()).to.equal(100);
    });

    it('should not allow divide by other currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(10, 'USD');

        expect(first.divide.bind(first, second)).to.throw(Error);
    });

    it('should allocate correctly', function() {
       var subject = new Money(1000, 'EUR');
       var results = subject.allocate([1,1,1]);

       expect(results.length).to.equal(3);
       expect(results[0].getAmount()).to.equal(333.34);
       expect(results[0].currency).to.equal('EUR');
       expect(results[1].getAmount()).to.equal(333.33);
       expect(results[1].currency).to.equal('EUR');
       expect(results[2].getAmount()).to.equal(333.33);
       expect(results[2].currency).to.equal('EUR');
    });

    it('should clone correctly', function () {
        var money = new Money(1000, 'EUR').clone();

        expect(money.getAmount()).to.equal(1000);
        expect(money.getCurrency()).to.equal('EUR');
    });

    it('should perform min correctly', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'EUR');
        expect(first.min(second).getAmount(500));
        expect(second.min(first).getAmount(500));
    });

    it('should not allow min if other currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'USD');

        expect(first.min.bind(first, second)).to.throw(Error);
    });

    it('should perform max correctly', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'EUR');
        expect(first.max(second).getAmount(1000));
        expect(second.max(first).getAmount(1000));
    });

    it('should not allow max if other currencies', function () {
        var first = new Money(1000, 'EUR');
        var second = new Money(500, 'USD');

        expect(first.max.bind(first, second)).to.throw(Error);
    });

    it('should correctly identify itself', function () {
        var first = new Money(1000, 'EUR');
        var second = {};

        expect(Money.isMoney(first)).to.equal(true);
        expect(Money.isMoney(second)).to.equal(false);
    });

    it('should construct a money object if needed', function () {
        var first = new Money(1000, 'EUR');
        var same = Money.constructMoneyIfMatching(first);
        expect(first).to.equal(same);

        var second = { amount: 100000, currency: 'EUR' };
        var newMoney = Money.constructMoneyIfMatching(second);

        expect(Money.isMoney(newMoney)).to.equal(true);
        expect(newMoney.getAmount()).to.equal(1000);
        expect(newMoney.getCurrency()).to.equal('EUR');
    });

});
