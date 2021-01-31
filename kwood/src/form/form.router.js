"use strict";
exports.__esModule = true;
var express_1 = require("express");
var form_service_1 = require("./form.service");
var router = express_1["default"].Router();
router.get('/:user', function (req, res, next) {
    form_service_1["default"].getFormsByUser(req.params.user).then(function (rest) {
        res.send(JSON.stringify(rest));
    });
});
exports["default"] = router;
