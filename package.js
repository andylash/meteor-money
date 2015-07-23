"use strict";

Package.describe({
  summary: "Several useful money libraries",
  version: "0.2.0",
  name: "andylash:money",
  git: "https://github.com/andylash/meteor-money-js.git"
});


Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.4');
  api.use('underscore', ['client', 'server']);
  api.use('ejson', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('mongo', ['client', 'server']);
  api.use('percolate:synced-cron@1.2.0', 'server');
  api.use(['cosmos:browserify@0.2.0'], 'client');

  Npm.depends({
    "money": '0.2.0',
    "money-core": '0.1.2'
  });

  //fx rates library
  api.addFiles('src/client/client.browserify.js', 'client');
  api.addFiles('src/common/globals.js', ['client', 'server']);


  //ejson types so Money type can be used in database and DDP
  api.addFiles('src/common/ejson_types.js', ['client', 'server']);

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

