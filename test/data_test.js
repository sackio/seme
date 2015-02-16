'use strict';

var Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
  , O = new Optionall({'__dirname': Path.resolve(module.filename + '/../..')})
  , Async = require('async')
  , _ = require('underscore')
  , Winston = require('winston')
  , FSTK = require('fstk')
  , Yessir = require('yessir')
  , Request = require('request')
  , Seme = require('../lib/seme.js')
;

var gb = {}
  , log = new Winston.Logger()
;

gb.seme = Seme(O);
gb.data = gb.seme.generators.data;

log.add(Winston.transports.Console, {'level': 'debug', 'colorize': true, 'timestamp': false});

exports['suite'] = {
  'setup': function(test) {
    if (gb.seme.settings.$ready) return test.done();

    return gb.seme.once('ready', test.done);
  },
  'get random words': function(test){
    var test_name = 'get random words';
    log.debug(test_name);
    log.profile(test_name);

    test.ok(gb.data.random.noun());
    test.ok(gb.data.random.phrase());
    test.ok(gb.data.random.adjective());
    test.ok(gb.data.random.descriptor());
    test.ok(gb.data.random.buzz());

    log.profile(test_name);
    return test.done();
  }
, 'get literary source': function(test){
    var test_name = 'get literary source';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getSource(function(err, src){
      test.ok(!err);
      test.ok(src);

      log.profile(test_name);
      return test.done();
    });
  }
, 'get quotes': function(test){
    var test_name = 'get quotes';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getQuotes('William Shakespeare', function(err, src){
      test.ok(!err);
      test.ok(_.any(src));

      log.profile(test_name);
      return test.done();
    });
  }
, 'get article': function(test){
    var test_name = 'get article';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getArticle('Pi', function(err, src){
      test.ok(!err);
      test.ok(src);

      log.profile(test_name);
      return test.done();
    });
  }
, 'get image url': function(test){
    var test_name = 'get image url';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getImageUrl('panda', function(err, url){
      test.ok(!err);
      test.ok(url);

      log.profile(test_name);
      return test.done();
    });
  }
, 'get multiple image urls': function(test){
    var test_name = 'get multiple image urls';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getImageUrl('eggrolls', {'quantity': 100}, function(err, url){
      test.ok(!err);
      test.ok(url.length === 100);

      log.profile(test_name);
      return test.done();
    });
  }
, 'get image file': function(test){
    var test_name = 'get image file';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getImageFile({
      'topic': 'french bulldog'
    , 'path': Path.join(O.__dirname, './data/test')
    }, function(err, file){
      test.ok(!err);
      test.ok(file.url && file.path);
      test.ok(FSTK._fs.existsSync(file.path));

      log.profile(test_name);
      return test.done();
    });
  }
, 'get multiple image files': function(test){
    var test_name = 'get multiple image files';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getImageFile({
      'topic': 'hamburger'
    , 'quantity': 10
    , 'path': Path.join(O.__dirname, './data/test')
    }, function(err, files){
      test.ok(!err);
      test.ok(files.length === 10);
      test.ok(_.every(files, function(f){
        return FSTK._fs.existsSync(f.path);
      }));

      log.profile(test_name);
      return test.done();
    });
  }
, 'get place': function(test){
    var test_name = 'get place';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getPlace({
      'location': 'washington dc'
    }, function(err, place){
      test.ok(!err)
      test.ok(place);

      log.profile(test_name);
      return test.done();
    });
  }
, 'get multiple places by query': function(test){
    var test_name = 'get multiple places by query';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getPlace({
      'query': 'barbers in boston'
    , 'types': gb.seme.fixtures.place_types
    , 'quantity': 5
    }, function(err, place){
      test.ok(!err);
      test.ok(place.length === 5);

      log.profile(test_name);
      return test.done();
    });
  }
, 'get product': function(test){
    var test_name = 'get product';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getProduct('wrench', function(err, prod){
      test.ok(!err);
      test.ok(prod);

      log.profile(test_name);
      return test.done();
    });
  }
, 'get multiple products': function(test){
    var test_name = 'get multiple products';
    log.debug(test_name);
    log.profile(test_name);

    return gb.data.getProduct('graphics card', {'quantity': 5}, function(err, prod){
      test.ok(!err);
      test.ok(prod.length === 5);

      log.profile(test_name);
      return test.done();
    });
  }
, 'get payment data': function(test){
    var test_name = 'get payment data';
    log.debug(test_name);
    log.profile(test_name);

    test.ok(gb.data.getCreditCard());
    test.ok(gb.data.getPaymentNonce());

    log.profile(test_name);
    return test.done();
  }
};
