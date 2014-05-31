var jade = require('jade');
var stylus = require('stylus');
var nib = require('nib');
var express = require('express');
var fs = require('fs');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
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
  app.use(express.static(__dirname + '/../bower_components'));

  app.get('*', function(req, res) {
    var path = req.url;
    while (path.indexOf('/') == 0) {
      path = path.substring(1);
    }
    if (path.indexOf('.html') == path.length-5) {
      path = path.substring(0, path.length-5);
      return res.render(path);
    }
    if (path == '') {
      return res.render('index');
    }

    return res.end(404, 'Not found');
  });
}

exports.init = init;
