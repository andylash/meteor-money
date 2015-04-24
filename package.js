"use strict";

Package.describe({
  summary: "Several useful money libraries",
  version: "0.2.0",
  name: "andylash:money",
  git: "https://github.com/andylash/meteor-money-js.git"
});


Package.onUse(function (api) {
  api.versionsFrom('METEOR@0.9.4');
  api.use('underscore', ['client', 'server']);
  api.use('ejson', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('mongo', ['client', 'server']);
  api.use('percolate:synced-cron@1.2.0', 'server');

  api.addFiles('src/common/globals.js', ['client', 'server']);

  //this is from https://www.npmjs.org/package/js-money
  // not pulling in NPM directly because we want it on client and server
  api.addFiles('js-money/money.js', ['client', 'server']);
  api.addFiles('js-money/currency.js', ['client', 'server']);


  //this is from http://openexchangerates.github.io/money.js/
  api.addFiles('money.js/money.js', ['client', 'server']);

  //ejson types so Money type can be used in database and DDP
  api.addFiles('src/common/ejson_types.js', ['client', 'server']);

  //add fx convesions to the Money object
  api.addFiles('src/common/money_conversions.js', ['client', 'server']);

  //fxrates collection
  api.addFiles('src/common/fxrates.js', ['client', 'server']);

  //index on fxrates collection
  api.addFiles('src/server/fxrates_index.js', 'server');

  //cron job to update fx rates
  api.addFiles('src/server/update_rates.js', ['server']);

  //publish function
  api.addFiles('src/server/publish.js', ['server']);

  api.export(['Money', 'FXRates', 'fx']);
  api.export(['FXRatesHelper'], 'server');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'underscore',
    'andylash:money'
  ], 'client');

  api.use(['spacejamio:munit@2.1.0'], 'client');

  api.addFiles('js-money/tests/money.test.js', 'client');
  api.addFiles('tests/money_conversions_tests.js', 'client');
});
