"use strict";
exports.__esModule = true;
var http_errors_1 = require("http-errors");
var express_1 = require("express");
var path_1 = require("path");
var morgan_1 = require("morgan");
var express_session_1 = require("express-session");
var memorystore_1 = require("memorystore");
var cors_1 = require("cors");
var index_1 = require("./staticrouter/index");
var user_router_1 = require("./user/user.router");
var form_router_1 = require("./form/form.router");
var constant_1 = require("./constant");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var app = express_1["default"]();
// view engine setup
app.set('views', path_1["default"].join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors_1["default"]({ origin: process.env.CLIENT, credentials: true }));
app.use(morgan_1["default"]('dev'));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
app.use(express_1["default"].static(constant_1["default"]));
app.use(express_session_1["default"]({
    secret: 'whatever',
    store: new (memorystore_1["default"](express_session_1["default"]))({ checkPeriod: 86400000 }),
    cookie: {}
}));
/*
 Set routers: First argument takes a 'route' string.
 The route string is the string of characters after our domain name that specifies what resources we are looking for.
 Basically the URN, but more general. (not a full urn, necessarily.)
 The second parameter is a "router". This is an object that will handle a request for me.
*/
app.use('/', index_1["default"]);
app.use('/users', user_router_1["default"]);
app.use('/form', form_router_1["default"]);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(http_errors_1["default"](404));
});
// error handler
app.use(function (err, req, res, next) {
    // Send error file
    res.status(err.status || 500);
    res.sendFile('/error.html', { root: constant_1["default"] });
});
module.exports = app;
