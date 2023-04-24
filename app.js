var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/web/index');
// 导入接口路由
var accountRouter = require('./routes/api/account');
// 导入注册登陆路由
var authRouter = require('./routes/web/auth');
// 导入注册登陆API路由
var authApiRouter = require('./routes/api/auth');

// 导入session操作相关包
const session = require("express-session");
const MongoStore = require('connect-mongo');
// 导入数据库连接配置文件
const config = require('./config');

var app = express();
// 使用中间件
app.use(session({
  name: 'sid', //设置cookie的name，默认值是：connect.sid
  secret: config.session_secret, //参与加密的字符串（又称签名）
  saveUninitialized: false, //是否为每次请求都设置一个cookie用来存储session的id
  resave: true, //是否在每次请求时重新保存session，用于重置session过期时间
  // 设置session存储位置
  store: MongoStore.create({
    // 存储到mongodb中
    // mongoUrl: `mongodb://${config.HOST}:${config.PORT}/${config.NAME}` //数据库的连接配置
    mongoUrl: config.URL
  }),
  // 浏览器端cookie设置
  cookie: {
    httpOnly: true, // 开启后前端无法通过 JS 操作
    maxAge: 1000 * 60 * 60 * 24 * 7 // 不仅控制cookie，也控制session的生命周期
  },
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// 使用注册登陆路由
app.use('/', authRouter);
// 使用接口路由，并添加api前缀
app.use('/api', accountRouter);
// 使用注册登陆API路由
app.use('/api', authApiRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('tip', { msg: '404', url: '/' });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
