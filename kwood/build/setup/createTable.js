"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = __importStar(require("aws-sdk"));
var user_service_1 = __importDefault(require("../user/user.service"));
var form_service_1 = __importDefault(require("../form/form.service"));
var log_1 = __importDefault(require("../log"));
AWS.config.update({ region: 'us-west-2' });
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
//remove Forms
var removeUsers = {
    TableName: 'users'
};
var removeForms = {
    TableName: 'forms'
};
//Schemas
var userSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'username',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'username',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'users',
    StreamSpecification: {
        StreamEnabled: false
    }
};
var formSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'N'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'forms',
    StreamSpecification: {
        StreamEnabled: false
    }
};
//delete tables
ddb.deleteTable(removeUsers, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    }
    else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(function () {
        ddb.createTable(userSchema, function (err, data) {
            if (err) {
                console.log('Error', err);
            }
            else {
                console.log('Table Created', data);
                setTimeout(function () {
                    populateUserTable();
                }, 10000);
            }
        });
    }, 5000);
});
ddb.deleteTable(removeForms, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    }
    else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(function () {
        ddb.createTable(formSchema, function (err, data) {
            if (err) {
                console.log('Error', err);
            }
            else {
                console.log('Table Created', data);
                setTimeout(function () {
                    populateFormTable();
                }, 10000);
            }
        });
    }, 10000);
});
//Populate tables
function populateFormTable() {
    log_1.default.debug('in populat form table');
    form_service_1.default.addForm({ id: 1, name: 'Rekina Novellia', username: 'Rekina', startDate: '2021-05-7', submitDate: new Date().toLocaleDateString(), time: 'MWF 10am - 2pm', location: 'Lakeland', description: 'A class on organizing large scale hunts', cost: 250, gradingFormat: 'traditional', typeOfEvent: 'University Course', justificationForEvent: 'The number of mercanaries have increased, we now have enought member to perform large scale hunts', rejected: false, status: 'Needs DS approval', involvedUsers: ['Rekina'], modified: false });
    form_service_1.default.addForm({ id: 2, name: 'Teacle Haromi', username: 'Teacle', startDate: '2021-01-15', submitDate: new Date().toLocaleDateString(), time: '6pm - 10pm', location: "Rak'tika Greatwood", description: 'A certificate that shows you are trained with amaros', cost: 500, gradingFormat: 'pass/fail', typeOfEvent: 'Certification', justificationForEvent: 'Certificate allows you to attend special amaro related classes', rejected: false, status: 'Needs DS approval', involvedUsers: ['Teacle'], modified: false });
    form_service_1.default.addForm({ id: 3, name: 'Rekina Novellia', username: 'Rekina', startDate: '2020-01-10', submitDate: new Date().toLocaleDateString(), time: 'MWF 10am - 2pm', location: 'Crystarium', description: 'y', cost: 250, gradingFormat: 'traditional', typeOfEvent: 'University Course', justificationForEvent: 'The number of mercanaries have increased, we now have enought member to perform large scale hunts', rejected: false, status: 'Needs DS approval', involvedUsers: ['Rekina'], modified: false });
    form_service_1.default.addForm({ id: 4, name: 'Ashe Longfin', username: 'Ashe', startDate: '2021-02-04', submitDate: new Date().toLocaleDateString(), time: 'MWF 7am - 3pm', location: 'Ruby Sea', description: 'Certificatoin for shipbuilding', cost: 300, gradingFormat: 'pass/fail', typeOfEvent: 'Certification', justificationForEvent: 'Learning the new ship building methods will allow us to further improve our skyships', rejected: false, status: 'Needs DS approval', involvedUsers: ['Ashe'], modified: false });
}
function populateUserTable() {
    log_1.default.trace('in populate User table');
    user_service_1.default.addUser({ username: 'Rekina', password: 'pass', superior: 'Cid', tuitionReimbursement: 1000, position: ['Employee', 'BenCo'], pendingReimbursements: 0, awardedReimbursements: 0 });
    user_service_1.default.addUser({ username: 'Teacle', password: 'caw', superior: 'Biggs', tuitionReimbursement: 1000, position: ['Employee', 'Supervisor'], pendingReimbursements: 0, awardedReimbursements: 0 });
    user_service_1.default.addUser({ username: 'Biggs', password: 'wedge', superior: 'Cid', tuitionReimbursement: 1000, position: ['Employee', 'Department Head'], pendingReimbursements: 0, awardedReimbursements: 0 });
    user_service_1.default.addUser({ username: 'Cid', password: 'garlond', superior: 'n/a', tuitionReimbursement: 1000, position: ['Employee', 'Department Head', 'BenCo'], pendingReimbursements: 0, awardedReimbursements: 0 });
    user_service_1.default.addUser({ username: 'Ashe', password: 'fish', superior: 'Teacle', tuitionReimbursement: 1000, position: ['Employee'], pendingReimbursements: 0, awardedReimbursements: 0 });
}
