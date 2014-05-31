var jade = require('jade');
var stylus = require('stylus');
var nib = require('nib');
var express = require('express');
var fs = require('fs');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

function init(app) {
  var source = __dirname + '/../client';
  app.set('views', source + '/views');
  app.set('view engine', 'jade');

  app.use(stylus.middleware({
    src: source,
    compile: compile,
    dest: __dirname + '/../build/'
  }));
  app.use(express.static(__dirname + '/../build'));
  app.use(express.static(source + '/static'));

  app.get('*.html', function(req, res) {
    var path = req.url;
    while (path.indexOf('/') == 0) {
      path = path.substring(1);
    }
    if (path.indexOf('.html') == path.length-5) {
      path = path.substring(0, path.length-5);
      if (path == '') {
        path = 'index';
      }
      return res.render(path);
    }

    return res.end(404, 'Not found');
  });
}

exports.init = init;
