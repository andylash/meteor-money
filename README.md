
# Money

A Money package for Meteor.

**Table of Contents**

- [Intro](#intro)
- [Api](#Api)
- [Rates](#rates)
- [TODO](#todo)
- [History](#history)
- [Contributing](#contributing)
- [License](#license)

## Intro
Your application needs to use money, but you've already been burned (or want to avoid) the problems with floating point math.  Or maybe you need to deal with multiple currencies in the same application.  If either of these apply you, then this package could be for you.

Instead of storing money values as Numbers in your app, you'll use the Money object.  Money objects hold a currency and an integer value sized appropriately for the type of currency.  In the case of US Dollars (and many other currencies like Euros), it stores values by multiplying the amount by 100.  This means you cannot store fractional cents with these Money objects.  Also it means you want to be careful to get the amount with the .getAmount() method (rather than the .amount property which will be off by a factor of 100).

Money objects are pretty careful to not let you add different currencies together, although this library does have addC and subtractC methods that convert on demand (if you've enabled that functionality).

If you want to get fx rates from openexchangerates, you need to go make an account there and put your appId in Meteor.settings.OpenExchange.appId.  If you want to see fx rates in your client, you need to also subscribe to 'money-package-fxrates' somewhere.

## API

    //Let's make a Money object
    var hundredBucks = new Money(100, 'USD');
    assert(hundredBucks.getAmount() === 100);

    //Let's add $50 to it
    var oneFifty = hundredBucks.add(new Money(50, 'USD'));
    assert(oneFifty.getAmount() === 150);

    //Let's add €50 to it
    var oneFiftyPlusFifyEuros = oneFifty.add(new Money(50, 'EUR'));
    //throws an error!  Why is that?  I assure you that you don't ever want to add 2 currencies together by accident
    var oneFiftyPlusFifyEuros = oneFifty.addC(new Money(50, 'EUR'));
    assert(oneFiftyPlusFifyEuros.getAmount() === 243);
    assert(oneFiftyPlusFifyEuros.getCurrency() === 'USD');
    //actually I'm not sure what the current exchange rate it, but you get the idea.

    //Let's subtract $25 from it
    var oneTwentyFive = hundredBucks.subtract(new Money(25, 'USD'));
    assert(oneTwentyFive.getAmount() === 125);



The full API details can be found by looking at the js-money/money.js and src/common/money_conversions.js files.  I'd really like to generate docs from them.  More docs coming soon!

## Rates
Reminder that to get these rates you need to make an account at https://openexchangerates.org/ and put your appId in Meteor.settings.OpenExchange.appId.

Right now the rates come from the openexchangerates api every day.  This works via a SyncedCron job (thanks Percolate Studios).  You can change how often this happens with the Meteor.settings.OpenExchange.updateSchedule setting.  It takes a later.js string.

To get the rates to work you MUST subscribe to the 'money-package-fxrates' publication.  Putting that subscription in by default seemed pointless as I figure everyone has some way of doing this in Iron Router.

Lastly, I'm sure it's clear that you wouldn't want to be trading fx instruments based on these rates, but hey I'm saying it anyway.

## TODO
* Deeper, better docs
* Configure parts of library on and off
* Exchange rates should be a plugin, not married to openexchangerates
* Figure out how to generate docs

## History
**Latest Version:** 0.1.0
- Initial release

## Contributing
If you've got a change you think would benefit the community send me a pull request.

## License
[The MIT License](http://opensource.org/licenses/MIT)

The core money object draws very extensively on work by David Kalosi. And thus some parts are
Copyright (c) 2014 David Kalosi [http://davidkalosi.com/](http://davidkalosi.com/)

The fx rate handling stuff comes from Open Exchange Rates.  Thus some parts are:
Copyright (c) 2014 Open Exchange Rates

> Written with [StackEdit](https://stackedit.io/).
