"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var dynamo_1 = require("../dynamo/dynamo");
var log_1 = require("../log");
var FormService = /** @class */ (function () {
    function FormService() {
        // The documentClient. This is our interface with DynamoDB
        this.doc = dynamo_1["default"]; // We imported the DocumentClient from dyamo.ts
    }
    //CRUD: Create
    FormService.prototype.addForm = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var today, leftover, numDaysInLastMonth, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = new Date();
                        //NOTE: startDate is submitted in format month-date-year
                        //if form is submitted within same month of start date
                        if (form.startDate.getMonth() == today.getMonth()) {
                            //if form is submitted < one week before or anytime after start date
                            if (form.startDate.getDate() > (today.getDate() - 7)) {
                                log_1["default"].trace('Form submitted one week before or anytime after start date');
                                form.rejected = true;
                                form.justification = "Form submitted too late, must be submitted atleast one week prior to event start.";
                                form.status = 'Rejected';
                                //if form is submitted before one week of start date; do nothing
                            }
                            //if form is submitted after start month
                        }
                        else if (form.startDate.getMonth() > today.getMonth()) {
                            log_1["default"].trace('Form submitted after start month');
                            form.rejected = true;
                            form.justification = "Form submitted too late, must be submitted atleast one week prior to event start.";
                            form.status = 'Rejected';
                            //if form is submitted before start month
                        }
                        else if (form.startDate.getMonth() < today.getMonth()) {
                            leftover = form.startDate.getDate() - 7;
                            numDaysInLastMonth = 0;
                            //WE ARE NOT ACCOUNTING FOR LEAP YEARS; 
                            //NOTE: in js, jan = 0
                            switch (today.getMonth()) {
                                case 0:
                                    numDaysInLastMonth = 31;
                                    break;
                                case 1:
                                    numDaysInLastMonth = 28;
                                    break;
                                case 2:
                                    numDaysInLastMonth = 31;
                                    break;
                                case 3:
                                    numDaysInLastMonth = 30;
                                    break;
                                case 4:
                                    numDaysInLastMonth = 31;
                                    break;
                                case 5:
                                    numDaysInLastMonth = 30;
                                    break;
                                case 6:
                                    numDaysInLastMonth = 31;
                                    break;
                                case 7:
                                    numDaysInLastMonth = 31;
                                    break;
                                case 8:
                                    numDaysInLastMonth = 30;
                                    break;
                                case 9:
                                    numDaysInLastMonth = 31;
                                    break;
                                case 10:
                                    numDaysInLastMonth = 30;
                                    break;
                                case 11:
                                    numDaysInLastMonth = 31;
                                    break;
                                default:
                                    log_1["default"].error('invalid month');
                                    break;
                            }
                            //if submitted after a week before event start
                            if (today.getDate() > (numDaysInLastMonth - leftover)) {
                                log_1["default"].trace('Form submitted after start month');
                                form.rejected = true;
                                form.justification = "Form submitted too late, must be submitted atleast one week prior to event start.";
                                form.status = 'Rejected';
                                //if submitted before, do nothing
                            }
                        }
                        params = {
                            TableName: 'forms',
                            Item: form,
                            ConditionExpression: '#id <> :id',
                            ExpressionAttributeNames: {
                                '#id': 'id'
                            },
                            ExpressionAttributeValues: {
                                ':id': form.id
                            }
                        };
                        return [4 /*yield*/, this.doc.put(params).promise().then(function (result) {
                                log_1["default"].info('Successfully created item');
                                return true;
                            })["catch"](function (error) {
                                log_1["default"].error(error);
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //CRUD: Read; get a form by id
    FormService.prototype.getFormByID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1["default"].debug('in getFormByID ' + id);
                        params = {
                            TableName: 'forms',
                            Key: {
                                'id': id
                            }
                        };
                        return [4 /*yield*/, this.doc.get(params).promise().then(function (data) {
                                if (data && data.Item) {
                                    log_1["default"].debug("data.Item: " + JSON.stringify(data.Item));
                                    return data.Item;
                                }
                                else {
                                    return null;
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //CRUD: Read, get forms by user
    FormService.prototype.getFormsByUser = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1["default"].debug('in getFormsByUser');
                        params = {
                            TableName: 'forms',
                            FilterExpression: '#email <> :email',
                            ExpressionAttributeNames: {
                                '#email': 'email'
                            },
                            ExpressionAttributeValues: {
                                ':email': email
                            }
                        };
                        return [4 /*yield*/, this.doc.scan(params).promise().then(function (data) {
                                if (data) {
                                    return data.Items;
                                }
                                else {
                                    return [];
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //get forms
    //CRUD: Update
    FormService.prototype.updateForm = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'forms',
                            Key: {
                                'id': form.id
                            },
                            UpdateExpression: 'set name = :n, email = :e, date = :d, time =:t, location = :l, description = :des, cost = :c, gradingFormat = :g, typeOfEvent = :ty, justification = :j, rejected = :r, status = :s, involvedUsers = :i, attachmentEvetns = :ae, attachmentsApproval = :aa, timeMissed = :tm',
                            ExpressionAttributeValues: {
                                ':n': form.name,
                                ':e': form.email,
                                ':d': form.startDate,
                                ':t': form.time,
                                ':l': form.location,
                                ':des': form.description,
                                ':c': form.cost,
                                ':g': form.gradingFormat,
                                ':ty': form.typeOfEvent,
                                ':j': form.justification,
                                ':r': form.rejected,
                                ':s': form.status,
                                ':i': form.involvedUsers,
                                ':ae': form.attachmentsEvent,
                                ':aa': form.attachmentsApproval,
                                ':tm': form.timeMissed
                            },
                            ReturnValues: 'UPDATED_NEW'
                        };
                        return [4 /*yield*/, this.doc.update(params).promise().then(function (data) {
                                log_1["default"].debug(data);
                                return true;
                            })["catch"](function (error) {
                                log_1["default"].error(error);
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //CRUD: Delete
    FormService.prototype.removeForm = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'forms',
                            Key: {
                                'id': form.id
                            }
                        };
                        return [4 /*yield*/, this.doc["delete"](params).promise().then((function (result) {
                                return true;
                            }))["catch"](function (error) {
                                log_1["default"].error(error);
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return FormService;
}());
var formService = new FormService();
exports["default"] = formService;
