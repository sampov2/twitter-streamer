var JSONStream = require('JSONStream');
var ObjectID = require('mongodb').ObjectID;

function init(app, db, coll) {

  app.get('/api/tweets', function(req, res) {
    var token = req.query.token;
    var match = {};
    if (token) {
      match._id = { '$gt': new ObjectID(token) };
    }
    coll.find(match, { limit: 20 }, function(err, cursor) {
      if (err) { console.error(err); return res.json(503, {error: true}); }
      res.set('Content-Type', 'application/json;charset=utf-8');
      cursor.stream().pipe(JSONStream.stringify()).pipe(res);
    })
  });
}

exports.init = init;
