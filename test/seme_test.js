'use strict';

var Seme = new require('../lib/seme.js')()
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , FSTK = require('fstk')
;

exports['seme'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'setup': function(test) {
    test.ok(Seme);
    test.ok(Seme.settings.google);
    test.done();
  },
  'freebase': function(test){
    var globals = {}
      , gb = globals;
    return Async.waterfall([
      function(cb){
        return Seme.services.freebase.description('Pink Floyd', Belt.cs(cb, globals, 'desc', 0));
      }
    , function(cb){
        test.ok(globals.desc);
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.description('Pisdafasdfsadfsadfd', Belt.cs(cb, globals, 'desc', 0));
      }
    , function(cb){
        test.ok(!globals.desc);
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.description('Radar', {sentence: true}, Belt.cs(cb, globals, 'desc', 0));
      }
    , function(cb){
        test.ok(globals.desc);
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.topic('/en/william_shakespeare', Belt.cs(cb, globals, 'topic', 0));
      }
    , function(cb){
        test.ok(globals.topic);
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.notable_type('william shakespeare', Belt.cs(cb, globals, 'result', 0));
      }
    , function(cb){
        test.ok(globals.result.name === 'Author');
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.list('operas', {'max': 50}, Belt.cs(cb, globals, 'result', 0));
      }
    , function(cb){
        test.ok(globals.result);
        return cb();
      }
    , function(cb){
        test.ok(Seme.services.faker.name.firstName());
        return cb();
      }
    , function(cb){
        test.ok(Seme.services.braintree.credit_card_numbers);
        test.ok(Seme.services.braintree.cvv_codes);
        return cb();
      }
    /*, function(cb){
        return Async.whilst(function(){ return !Seme.services.flickr; }
                           , function(next){ return setTimeout(next, 1000); }
                           , function(){
                               return Seme.services.flickr.photos.search({'text': 'panda'}
                                      , Belt.cs(cb, globals, 'result', 1, 0));
                             });
      }
    , function(cb){
        //console.log(JSON.stringify(globals.result, null, 2));
        //console.log(_.map(globals.result.photos.photo, Seme.services.flickr.url));
        test.ok(globals.result);
        return cb();
      }*/
    , function(cb){
        return Seme.services.amazon.itemSearch({
          'keywords': 'Pulp fiction',
          'searchIndex': 'DVD',
          'responseGroup': 'ItemAttributes,Offers,Images'}
          , Belt.cs(cb, globals, 'products', 1, 0));
      }
    , function(cb){
        test.ok(globals.products);
        //console.log(JSON.stringify(globals.products));
        return cb();
      }
    , function(cb){
        return Seme.services.wikisource.getArticle('Frankenstein/Chapter_11'
        , Belt.cs(cb, globals, 'source', 0));
      }
    , function(cb){
        test.ok(globals.source);
        //console.log(globals.source);
        return cb();
      }
    , function(cb){
        return Seme.services.wikipedia.getArticle('Abraham_Lincoln'
        , Belt.cs(cb, globals, 'source', 0));
      }
    , function(cb){
        test.ok(globals.source);
        //console.log(globals.source);
        return cb();
      }
    , function(cb){
        return Seme.services.wikiquote.getArticle('Pablo_Picasso'
        , Belt.cs(cb, globals, 'source', 0));
      }
    , function(cb){
        test.ok(globals.source);
        //console.log(globals.source);
        return cb();
      }
    , function(cb){
        var nounInflector = new Seme.services.language.NounInflector();
        test.ok(nounInflector.pluralize('radius') === 'radii');
        return cb();
      }
    , function(cb){
        var parameters = {
          location:[-33.8670522, 151.1957362],
          types:"restaurant"
        };
        return Seme.services.google_places.placeSearch(parameters, function(response){
          test.ok(response.results);
          //console.log(response.results);
          globals.place = Belt._get(response, 'results.0');
          return cb();
        });
      }
    , function(cb){
        return Seme.services.google_places.details(globals.place.place_id, Belt.cs(cb, globals, 'place_details', 1, 0));
      }
    , function(cb){
        //console.log(globals.place_details);
        test.ok(globals.place_details.photos);
        return cb();
      }
    , function(cb){
        return Seme.services.google_places.photo(Belt._get(globals, 'place_details.photos.0.photo_reference')
        , Belt.cs(cb, globals, 'photo_path', 1, 0));
      }
    , function(cb){
        test.ok(FSTK._fs.existsSync(globals.photo_path));
        return cb();
      }
    , function(cb){
        return Seme.services.wikipedia.getPagesInCategory('Heads_of_the_Communist_Party_of_the_Soviet_Union'
        , Belt.cs(cb, gb, 'articles', 0));
      }
    , function(cb){
        test.ok(gb.articles);
        //console.log(gb.articles);
        return Seme.services.wikipedia.getArticle(gb.articles[1].title.replace(/\s/g, '_')
        , Belt.cs(cb, gb, 'source', 0));
      }
    , function(cb){
        test.ok(gb.source);
        console.log(Seme.services.wikimedia.parseSentences(gb.source));

        return cb();
      }
    ], function(err){
      if (err) console.error(err);
      test.ok(!err);
      return test.done();
    });
  }
};
