var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');
var usersRouter = require('./routes/users');
var fs = require('fs');
var app = express();

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var multer = require('multer');

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	if(req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
	else next();
});

app.set('port', process.env.PORT || 3000)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

//app.use(favicon(__dirname+'/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({
	limit: '10mb',
	extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({
	dest: './public/images',
	rename: function(fieldname, filename) {
		return filename;
	}
}));
//app.use(express.bodyParser({
//	uploadDir: __dirname + ‘/upload’,
//	keepExtensions: true,
//	limit: ‘50 mb’
//}));
//app.use(express.bodyParser({
//	connect: ‘50 mb’
//}));
app.use(session({
	secret: settings.cookieSecret,
	key: settings.db, //cookie name
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	}, //7 days
	store: new MongoStore({
		db: settings.db,
		host: settings.host,
		port: settings.port
	})
}));

routes(app);

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'))
})