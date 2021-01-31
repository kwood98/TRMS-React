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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dynamo_1 = __importDefault(require("../dynamo/dynamo"));
var log_1 = __importDefault(require("../log"));
var user_service_1 = __importDefault(require("../user/user.service"));
var FormService = /** @class */ (function () {
    function FormService() {
        // The documentClient. This is our interface with DynamoDB
        this.doc = dynamo_1.default; // We imported the DocumentClient from dyamo.ts
    }
    //CRUD: Create
    FormService.prototype.addForm = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var today, startDate, weekBefore, twoWeekBefore, dayPrevMonth, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = new Date();
                        startDate = new Date(form.startDate);
                        //start Date is before this year
                        if (startDate.getFullYear() < today.getFullYear()) {
                            form.rejected = true;
                            form.status = 'Rejected';
                            form.submitDate = today.toLocaleDateString();
                            form.justificationForRejection = "Form submitted too late, must be submitted atleast one week prior to event start.";
                            form.urgent = false;
                            //start date is on or after this year
                        }
                        else {
                            //if form is submitted within same month of start date
                            if (startDate.getMonth() == today.getMonth()) {
                                //if form is submitted > one week before start date
                                if ((startDate.getDate() - 7) > (today.getDate())) {
                                    form.rejected = false;
                                    form.status = 'Needs DS approval';
                                    form.submitDate = today.toLocaleDateString();
                                    if ((startDate.getDate() - 14) < (today.getDate())) {
                                        form.urgent = true;
                                    }
                                    else {
                                        form.urgent = false;
                                    }
                                    //if form is submitted after one week of start date
                                }
                                else {
                                    form.rejected = true;
                                    form.status = 'Rejected';
                                    form.submitDate = today.toLocaleDateString();
                                    form.justificationForRejection = "Form submitted too late, must be submitted atleast one week prior to event start.";
                                    form.urgent = false;
                                }
                                //if form is submitted after month
                            }
                            else if (startDate.getMonth() < today.getMonth()) {
                                form.rejected = true;
                                form.justificationForRejection = "Form submitted too late, must be submitted atleast one week prior to event start.";
                                form.status = 'Rejected';
                                form.submitDate = today.toLocaleDateString();
                                form.urgent = false;
                                //if form is submitted before start month
                            }
                            else if (startDate.getMonth() > today.getMonth()) {
                                //if form is submitted only one month out
                                if ((startDate.getMonth() - 1) == today.getMonth()) {
                                    weekBefore = startDate.getDate() - 7;
                                    twoWeekBefore = startDate.getDate() - 14;
                                    dayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
                                    //if weekBefore is negative (week before start was in last month)
                                    if (weekBefore < 0) {
                                        //find how many days in the previous month
                                        //if submitted after the week mark; 
                                        if (today.getDate() > (dayPrevMonth + weekBefore)) {
                                            form.rejected = true;
                                            form.justificationForRejection = "Form submitted too late, must be submitted atleast one week prior to event start.";
                                            form.status = 'Rejected';
                                            form.submitDate = today.toLocaleDateString();
                                            form.urgent = false;
                                            if (today.getDate() > (dayPrevMonth + twoWeekBefore)) {
                                                form.urgent = true;
                                            }
                                        } //else form is submitted in time and we don't want to do anything
                                        //if weekBefore is positive (week before start is in this month)
                                    }
                                    else {
                                        //form submitted after the submission deadline
                                        if (weekBefore < today.getDate()) {
                                            form.rejected = true;
                                            form.justificationForRejection = "Form submitted too late, must be submitted atleast one week prior to event start.";
                                            form.status = 'Rejected';
                                            form.submitDate = today.toLocaleDateString();
                                            form.urgent = false;
                                            //else form is submitted within deadline
                                        }
                                        else {
                                            form.rejected = false;
                                            form.status = 'Needs DS approval';
                                            form.submitDate = today.toLocaleDateString();
                                            form.urgent = false;
                                        }
                                    }
                                    //if form is submitted more than one month out we want to do nothing
                                }
                                else {
                                    form.rejected = false;
                                    form.status = 'Needs DS approval';
                                    form.submitDate = today.toLocaleDateString();
                                    form.urgent = false;
                                }
                            }
                        }
                        setTimeout(function () {
                            //lets find out the estimated reimbursement
                            var estimatedReimbursement = 0;
                            user_service_1.default.getUserByUsername(form.username).then(function (user) {
                                if (user) {
                                    form.DS = user.superior;
                                    var availableReimbursement = user.tuitionReimbursement - user.awardedReimbursements - user.pendingReimbursements;
                                    switch (form.typeOfEvent) {
                                        case 'University Course':
                                            estimatedReimbursement = form.cost * .8;
                                            break;
                                        case 'Seminar':
                                            estimatedReimbursement = form.cost * .6;
                                            break;
                                        case 'Certification Preperation Class':
                                            estimatedReimbursement = form.cost * .75;
                                            break;
                                        case 'Certification':
                                            estimatedReimbursement = form.cost;
                                            break;
                                        case 'Technical Training':
                                            estimatedReimbursement = form.cost * .9;
                                            break;
                                        default:
                                            estimatedReimbursement = form.cost * .3;
                                            break;
                                    }
                                    //if estimated reimbursement is more than user has available, set it to be equal to what is left
                                    if (estimatedReimbursement > availableReimbursement) {
                                        form.estimatedReimbursement = availableReimbursement;
                                    }
                                    else {
                                        form.estimatedReimbursement = estimatedReimbursement;
                                    }
                                    formService.updateForm(form);
                                    //only update user if form is not rejected
                                    if (form.rejected == false) {
                                        user.pendingReimbursements += Number(form.estimatedReimbursement);
                                        user_service_1.default.updateUser(user);
                                    }
                                }
                            });
                        }, 5000);
                        form.toBeAwarded = 0;
                        form.awardedReimbursement = 0;
                        params = {
                            TableName: 'forms',
                            Item: form,
                            ConditionExpression: '#id <> :id',
                            ExpressionAttributeNames: {
                                '#id': 'id',
                            },
                            ExpressionAttributeValues: {
                                ':id': form.id,
                            }
                        };
                        return [4 /*yield*/, this.doc.put(params).promise().then(function (result) {
                                log_1.default.info('Successfully created item');
                                return true;
                            }).catch(function (error) {
                                log_1.default.error(error);
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //get all forms
    FormService.prototype.getAllForms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'forms',
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
    //CRUD: Read; get a form by id
    FormService.prototype.getFormByID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'forms',
                            Key: {
                                'id': id,
                            }
                        };
                        return [4 /*yield*/, this.doc.get(params).promise().then(function (data) {
                                return data.Item;
                            }).catch(function (err) {
                                log_1.default.error(err);
                                return null;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //CRUD: Read, get forms by user
    FormService.prototype.getFormsByUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'forms',
                            FilterExpression: '#username = :username',
                            ExpressionAttributeNames: {
                                '#username': 'username'
                            },
                            ExpressionAttributeValues: {
                                ':username': username
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
                            UpdateExpression: 'set #name = :n, username = :u, #date = :d, #time =:t, #location = :l, description = :des, cost = :c, gradingFormat = :g, typeOfEvent = :ty, justification = :j, rejected = :r, #status = :s, involvedUsers = :i, estimatedReimbursement = :er, DS = :ds, modified = :m, toBeAwarded = :tba, awardedReimbursement = :ar',
                            ExpressionAttributeNames: {
                                '#name': 'name',
                                '#date': 'date',
                                '#time': 'time',
                                '#location': 'location',
                                '#status': 'status'
                            },
                            ExpressionAttributeValues: {
                                ':n': form.name,
                                ':u': form.username,
                                ':d': form.startDate,
                                ':t': form.time,
                                ':l': form.location,
                                ':des': form.description,
                                ':c': form.cost,
                                ':g': form.gradingFormat,
                                ':ty': form.typeOfEvent,
                                ':j': form.justificationForEvent,
                                ':r': form.rejected,
                                ':s': form.status,
                                ':i': form.involvedUsers,
                                ':er': form.estimatedReimbursement,
                                ':ds': form.DS,
                                ':m': form.modified,
                                ':tba': form.toBeAwarded,
                                ':ar': form.toBeAwarded
                            },
                            ReturnValues: 'UPDATED_NEW'
                        };
                        return [4 /*yield*/, this.doc.update(params).promise().then(function (data) {
                                log_1.default.info('Successfully updated item');
                                return true;
                            }).catch(function (error) {
                                log_1.default.error(error);
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
                        return [4 /*yield*/, this.doc.delete(params).promise().then((function (result) {
                                return true;
                            })).catch(function (error) {
                                log_1.default.error(error);
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
exports.default = formService;
