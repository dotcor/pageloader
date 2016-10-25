var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var jsdom = require('jsdom');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/blog', function(req, res){
	request({uri: 'https://some.webpage.com'}, function(err, response, body){
		var self = this;
		self.items = [];

		//Just a basic error check
		if(err && response.statusCode !== 200){console.log('Request error.');}

		jsdom.env({
			html: body,
			scripts: ['http://code.jquery.com/jquery-1.10.2.min.js'],
			done: function(err, window){
				var $ = window.jQuery;
				var $body = $('body');

				// Extract whatever you want from the page

				res.end( $body.length );
			}
		});
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
