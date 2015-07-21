var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
;

module.exports = function(Seme, O){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')});

  var M = {};
  M.settings = Belt.extend({

  }, [Opts]);

  //faker lorem
  M['random'] = Seme.services.faker.lorem;
  M['random'].phrase = Seme.services.faker.company.catchPhrase;
  M['random'].adjective = Seme.services.faker.company.bsAdjective;
  M['random'].descriptor = Seme.services.faker.company.catchPhraseDescriptor;
  M['random'].noun = Seme.services.faker.company.bsNoun;
  M['random'].buzz = Seme.services.faker.company.bsBuzz;

  M['random'].file_stream = function(options){
    var o = options || {};
    o = _.defaults(o, {
      'start': 1
    , 'end': 501
    });

    return FSTK._fs.createReadStream('/dev/urandom', o);
  };

  M['getSource'] = function(options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {
      'source': Seme.fixtures.sources[_.sample(_.keys(Seme.fixtures.sources))]
    });
    a.o = _.defaults(a.o, {
      'section': Belt.random_int(1, Belt.cast(Belt.get(a.o, 'source.sections'), 'number') + 1)
    });

    return Seme.services.wikisource.getArticle(a.o.source.title + a.o.section, function(err, src){
      return a.cb(err, src ? Belt.strip_html(src, {'breaks': true}) : undefined);
    });
  };

  M['getArticle'] = function(topic, options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {

    });

    return Seme.services.wikipedia.getArticle(topic, function(err, src){
      return a.cb(err, src ? Belt.strip_html(src, {'breaks': true}) : undefined);
    });
  };

  M['getQuotes'] = function(speaker, options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {

    });

    return Seme.services.wikiquote.getArticle(speaker, function(err, src){
      src = src.match(/\s\B\*(?= ).+\n/g) || [];
      src = _.map(src, function(s){ return s.replace(/^\s\* (.*)\n$/, '$1'); });
      src = _.reject(src, function(s){ return s.match(/^\W/) || s.match(/quot|note|:|p\. /i); });
      src = _.map(src, function(s){ return Belt.strip_html(s, {'breaks': true}); });
      return a.cb(err, src);
    });
  };

  M['getImageUrl'] = function(topic, options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {
      'text': topic //required
    , 'quantity': 1
    });

    a.o.per_page = a.o.quantity;

    return Seme.services.flickr.photos.search(a.o, function(err, res){
      var photos = Belt.get(res, 'photos.photo');
      return a.cb(err, photos ? Belt.deArray(_.map(photos, Seme.services.flickr.url)) : undefined);
    });
  };

  /*
    save a picture from flickr to a file
  */
  M['getImageFile'] = function(options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {
      'topic': '' //required
    , 'quantity': 1
    , 'name': function(n){ return n.split('/').pop(); }
    , 'concurrency': 10
    });

    var gb = {};
    return Async.waterfall([
      function(cb){
        return self.getImageUrl(a.o.topic, a.o, Belt.cs(cb, gb, 'urls', 1, 0));
      }
    , function(cb){
        return Async.mapLimit(Belt.toArray(gb.urls || []), a.o.concurrency, function(u, _cb){
          return FSTK.getURL(u, {'dest_path': (a.o.path ? Path.join(a.o.path, '/', a.o.name(u)) : undefined)}
          , function(err, path){
            return _cb(err, path ? {'path': path, 'url': u} : undefined);
          });
        }, Belt.cs(cb, gb, 'urls', 1, 0));
      }
    ], function(err){
      return a.cb(err, Belt.deArray(gb.urls));
    });
  };

  /*
    get a real place from a provided location
  */
  M['getPlace'] = function(options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {
      'types': _.sample(Seme.fixtures.place_types)
    , 'quantity': 1
    , 'concurrency': 10
    });

    var gb = {};
    return Async.waterfall([
      function(cb){
        if (!a.o.location) return cb();
        return Seme.services.location.get_coordinates(a.o.location, Belt.cs(cb, a.o, 'location', 1, 0));
      }
    , function(cb){
        if (a.o.location){
          a.o.location = _.isArray(a.o.location) ? a.o.location[0] : a.o.location;
          a.o.location = [a.o.location.lat, a.o.location.lng];
        }

        return Seme.services.google_places.placeSearch(a.o, Belt.cs(cb, gb, 'results', 1, 0));
      }
    , function(cb){
        gb.results = (Belt.get(gb.results, 'results') || []).splice(0, a.o.quantity);

        return Async.mapLimit(gb.results, a.o.concurrency, function(r, _cb){
          return Seme.services.google_places.details(Belt.get(r, 'place_id'), function(err, det){
            r = Belt.extend(r, det || {});
            r = Seme.services.google_places.photo_urls(r);

            r = {
              'name': r.name
            , 'address': r.formatted_address
            , 'phone': r.formatted_phone_number
            , 'website': r.website
            , 'photos': r.photos
            , 'icon': r.icon
            , 'hours': r.opening_hours
            , 'geolocation': Belt.get(r, 'geometry.location')
            , 'types': r.types
            , 'details': r
            };

            return _cb(err, r);
          });
        }, Belt.cs(cb, gb, 'results', 1, 0));
      }
    ], function(err){
      return a.cb(err, _.any(gb.results) ? Belt.deArray(gb.results) : undefined);
    });
  };

  /*
    get a product from Amazon
  */
  M['getProduct'] = function(keywords, options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {
      'keywords': keywords
    , 'searchIndex': 'All'
    , 'responseGroup': 'ItemAttributes,Images'
    , 'quantity': 1
    });

    return Seme.services.amazon.itemSearch(a.o, function(err, res){
      var prods;
      if (res) {
        prods = res.splice(0, a.o.quantity);
        prods = _.map(prods || [], function(p){
          return {
            'title': Belt.get(p, 'ItemAttributes.0.Title.0')
          , 'url': Belt.get(p, 'DetailPageURL')
          , 'images': Belt.deepPluck((Belt.get(p, 'ImageSets') || []), 'ImageSet.0.LargeImage.0.URL.0')
          , 'catalogs': Belt.get(p, 'ItemAttributes.0.Binding')
          , 'brand': Belt.get(p, 'ItemAttributes.0.Brand.0')
          , 'features': Belt.get(p, 'ItemAttributes.0.Feature')
          , 'price': Belt.get(p, 'ItemAttributes.0.ListPrice.0.FormattedPrice.0')
          , 'details': p
          };
        });
      }
      return a.cb(err, _.any(prods) ? Belt.deArray(prods) : undefined);
    });
  };

  /*
    return sample credit cards
  */
  M['getCreditCard'] = function(options){
    var o = options || {};
    o = _.defaults(o, {
      'type': _.sample(_.keys(Seme.services.braintree.credit_card_numbers.valid))
    });

    return {
      'type': o.type
    , 'number': Belt.deArray(_.sample(Seme.services.braintree.credit_card_numbers.valid[o.type]))
    };
  };

  M['getPaymentNonce'] = function(options){
    var o = options || {};
    o = _.defaults(o, {
      'type': 'credit'
    });

    return Seme.services.braintree.Nonces[o.type === 'credit' ? 'Transactable' : 'PayPalFuturePayment'];
  };

  return M;
};
