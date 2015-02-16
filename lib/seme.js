/*
 * seme
 * https://github.com/sackio/seme
 *
 * Copyright (c) 2014 Ben Sack
 * Licensed under the MIT license.
 */

var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Path = require('path')
  , Optionall = require('optionall')
  , Events = require('events')
  , Locup = require('locup')
  , Generators = {}
  , Services = {}
  , Fixtures = {}
;

Fixtures = FSTK._fs.readdirSync(Path.join(module.filename, '../fixtures'));
Fixtures = _.object(_.map(Fixtures, function(g){ return FSTK.filename(g); })
                    , _.map(Fixtures, function(g){ return require(Path.join(module.filename, '../fixtures', '/', g)); }));

Generators = FSTK._fs.readdirSync(Path.join(module.filename, '../generators'));
Generators = _.object(_.map(Generators, function(g){ return FSTK.filename(g); })
                    , _.map(Generators, function(g){ return require(Path.join(module.filename, '../generators', '/', g)); }));

Services = FSTK._fs.readdirSync(Path.join(module.filename, '../services'));
Services = _.object(_.map(Services, function(g){ return FSTK.filename(g); })
                  , _.map(Services, function(g){ return require(Path.join(module.filename, '../services', '/', g)); }));

module.exports = function(O){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')});

  var M = new (Events.EventEmitter.bind({}))();
  M.settings = Belt.extend({
    '$ready': false
  }, Opts);

  M.once('ready', function(){
    return this.settings.$ready = true;
  });

  M['generators'] = Generators;
  M['services'] = Services;
  M['fixtures'] = Fixtures;

  M.services.freebase = new M.services.freebase(M.settings.google);
  M.services.faker = new M.services.faker(M.settings);
  M.services.braintree = new M.services.braintree(M.settings);

  M.services._flickr = M.services.flickr;
  M.services.flickr = undefined;
  M.services._flickr(M.settings, function(err, flickr){
    delete M.services._flick;
    M.services.flickr = flickr;
    return M.emit('ready');
  });

  M.services.amazon = new M.services.amazon(M.settings);
  M.services.wikimedia = new M.services.wikimedia(M.settings);
  M.services.wikisource = M.services.wikimedia.wikisource;
  M.services.wikipedia = M.services.wikimedia.wikipedia;
  M.services.wikiquote = M.services.wikimedia.wikiquote;
  M.services.language = new M.services.language(M.settings);
  M.services.location = new Locup({'api_key': M.settings.google.key, 'mapquest': M.settings.mapquest});
  M.services.google_places = new M.services.google_places(M.settings);

  M.generators.data = new M.generators.data(M, M.settings);

  return M;
};
