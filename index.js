var _ = require('underscore');
var request = require('request');

module.exports.lookupAddress = function(address, callback) {
  address = address.replace(' ', '+');
  address = encodeURIComponent(address);

  request.get({
    url: 'https://api.postur.is/PosturIs/ws.asmx/GetPostals?address=' + address
  }, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      return callback(error);
    }

    // There is a enclosing () in the response
    var data  = JSON.parse(body.replace(/[()]/g, ''));
    data = _.flatten(data);

    var results = _.map(data, function(elem) {
      return {
        street: elem.Gata,
        house: elem.Husnumer,
        zip: elem.Postnumer,
        city: elem.Sveitafelag,
        apartment: elem.Ibud,
        letter: elem.Stafur
      };
    });

    return callback(null, results);
  });
};
