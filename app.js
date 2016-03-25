/**
 * 程序主入口
 */

var express = require('express'),
    routes = require('./routes/index.js'),
    http = require('http'),
    path = require('path'),
    app = express(),
    cookieSession = require('cookie-session'),
    favicon = require('express-favicon'),
    settings = require('./settings'),
    fs = require('fs'),
    accessLog = fs.createWriteStream('access.log', {'flags': 'a'}),
    errorLog = fs.createWriteStream('error.log', {'flags': 'a'}),
    env = settings.env;

app.set('port', process.env.PORT || settings[env].port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.engine('.html', require('ejs').__express);
//	设置后缀名为.html的文件里面存放ejs代码

app.use(favicon(path.join(__dirname, "./public/image/favicon.ico")));
app.use(express.logger('dev'));

app.use(express.logger({'stream': accessLog}));

app.use(express.bodyParser({
    'keepExtensions': true,
    'uploadDir': settings.postImagePath
}));
//	保留文件的后缀名和上传路径

app.use(cookieSession({
    secret: settings.cookieSecret,
    key: settings[env].db,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}
}));
//	写入cookie和session

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + ']' + req.url + '\n';
    errorLog.write(meta + err.static + '\n');
    next();
});
//  开启日志

//	开发环境开启错误
if (env == "develop") {
    app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
