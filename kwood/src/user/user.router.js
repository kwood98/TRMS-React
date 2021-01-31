"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var express_1 = require("express");
var log_1 = require("../log");
var constant_1 = require("../constant");
var router = express_1["default"].Router();
/* GET users listing. */
router.get('/login', function (req, res, next) {
    // If I'm already logged in, why would I log in again?
    if (req.session.user) {
        console.log(req.session.user);
        res.redirect('/');
    }
    res.sendFile('login.html', { root: constant_1["default"] });
});
router.get('/', function (req, res, next) {
    var u = __assign({}, req.session.user);
    delete u.password;
    res.send(JSON.stringify(u));
});
router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) { return log_1["default"].error(err); });
    res.redirect('/');
});
exports["default"] = router;
