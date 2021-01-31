"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var log_1 = __importDefault(require("../log"));
var form_service_1 = __importDefault(require("./form.service"));
var router = express_1.default.Router();
router.get('/:user', function (req, res, next) {
    //if requesting forms by user
    if (isNaN(Number(req.params.user))) {
        log_1.default.debug('in get/forms ' + req.params.user);
        form_service_1.default.getFormsByUser(req.params.user).then(function (rest) {
            console.log(req.params.username);
            res.send(JSON.stringify(rest));
        });
        // if requesting forms by id
    }
    else {
        log_1.default.debug('in get/forms/id ' + req.params.user);
        form_service_1.default.getFormByID(Number(req.params.user)).then(function (form) {
            log_1.default.debug(form === null || form === void 0 ? void 0 : form.startDate);
            res.send(JSON.stringify(form));
        });
    }
});
router.get('/', function (req, res, next) {
    form_service_1.default.getAllForms().then(function (forms) {
        res.send(JSON.stringify(forms));
    });
});
router.put('/', function (req, res, next) {
    form_service_1.default.updateForm(req.body).then(function (data) {
        res.send(data);
    });
});
router.post('/', function (req, res, next) {
    form_service_1.default.addForm(req.body).then(function (data) {
        log_1.default.debug(data);
        res.sendStatus(201);
    }).catch(function (err) {
        log_1.default.error(err);
        res.sendStatus(500); // Server error, sorry
    });
});
exports.default = router;
