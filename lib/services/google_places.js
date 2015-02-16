var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
  , Places = require('googleplaces')
  , Request = require('request')
;

module.exports = function(O){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')});

  var M = {};
  M.settings = Belt.extend({

  }, [Opts, Opts.google]);

  M = new Places(M.settings.key, 'json');

  M.types = ['accounting','airport','amusement_park','aquarium','art_gallery','atm','bakery','bank','bar','beauty_salon','bicycle_store','book_store','bowling_alley','bus_station','cafe','campground','car_dealer','car_rental','car_repair','car_wash','casino','cemetery','church','city_hall','clothing_store','convenience_store','courthouse','dentist','department_store','doctor','electrician','electronics_store','embassy','establishment','finance','fire_station','florist','food','funeral_home','furniture_store','gas_station','general_contractor','grocery_or_supermarket','gym','hair_care','hardware_store','health','hindu_temple','home_goods_store','hospital','insurance_agency','jewelry_store','laundry','lawyer','library','liquor_store','local_government_office','locksmith','lodging','meal_delivery','meal_takeaway','mosque','movie_rental','movie_theater','moving_company','museum','night_club','painter','park','parking','pet_store','pharmacy','physiotherapist','place_of_worship','plumber','police','post_office','real_estate_agency','restaurant','roofing_contractor','rv_park','school','shoe_store','shopping_mall','spa','stadium','storage','store','subway_station','synagogue','taxi_stand','train_station','travel_agency','university','veterinary_care','zoo'];

  M.settings = Belt.extend({

  }, [Opts, Opts.google]);

  M.details = function(place_id, options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {
    
    });
    return Request({
      'json': true
    , 'url': 'https://maps.googleapis.com/maps/api/place/details/json'
    , 'qs': {'key': M.settings.key, 'placeid': place_id}
    }, function(err, response, body){
      return a.cb(err, Belt._get(body, 'result'));
    });
  };

  M['photo_urls'] = function(details, options){
    var d = Belt.cast(details, 'object');
    if (!_.any(d.photos)) return d;

    var o = options || {};
    o = _.defaults(o, {
      'max_height': 1600
    , 'max_width': 1600
    });

    d.photos = _.chain(d.photos)
                .reject(function(p){ return !p.photo_reference; })
                .map(function(p){
                  return ['https://maps.googleapis.com/maps/api/place/photo?key=', M.settings.key
                         , '&photoreference=', p.photo_reference
                         , '&maxheight=', o.max_height
                         , '&maxwidth=', o.max_width].join('');
                })
                .value();

    return d;
  };

  M['photo'] = function(photo_ref, options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {
      'max_height': 1600
    , 'max_width': 1600
    , 'dest_path': FSTK.tempfile()
    });

    return FSTK.getURL(['https://maps.googleapis.com/maps/api/place/photo?key='
                      , M.settings.key, '&photoreference=', photo_ref, '&maxheight='
                      , a.o.max_height, '&maxwidth=', a.o.max_width].join('')
                      , a.o, function(err){
                        return a.cb(err, a.o.dest_path);
                      });
  };

  return M;
};
