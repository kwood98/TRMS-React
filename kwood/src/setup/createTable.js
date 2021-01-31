"use strict";
exports.__esModule = true;
var AWS = require("aws-sdk");
var user_service_1 = require("../user/user.service");
var form_service_1 = require("../form/form.service");
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
            AttributeName: 'email',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'email',
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
    }, 5000);
});
//Populate tables
function populateUserTable() {
    user_service_1["default"].addUser({ email: 'rekina@crystarium.net', password: 'pass', superior: 'cas@crystarium.net', tuitionReimbursmentAvailable: 1000, position: ['BenCo'] });
    user_service_1["default"].addUser({ email: 'teacle@crystarium.net', password: 'caw', superior: 'astral@crystarium.net', tuitionReimbursmentAvailable: 1000, position: ['Employee'] });
    user_service_1["default"].addUser({ email: 'astral@crystarium.net', password: 'silver', superior: 'cas@crystarium.net', tuitionReimbursmentAvailable: 1000, position: ['Department Head'] });
    user_service_1["default"].addUser({ email: 'cas@crystarium.net', password: 'zish', superior: 'exarch@crystarium.net', tuitionReimbursmentAvailable: 1000, position: ['Department Head', 'BenCo'] });
}
function populateFormTable() {
    form_service_1["default"].addForm({ id: 1, name: 'Rekina Novellia', email: 'rekina@crystarium.net', startDate: new Date('2021-05-5'), time: 'MWF 10am - 2pm', location: 'Lakeland', description: 'A class on organizing large scale hunts', cost: 250, gradingFormat: 'traditional', typeOfEvent: 'class', justification: 'The number of mercanaries have increased, we now have enought member to perform large scale hunts', rejected: false, status: 'Need DS approval', involvedUsers: ['rekina@crystarium.net'] });
    form_service_1["default"].addForm({ id: 2, name: 'Teacle Haromi', email: 'teacle@crystarium.net', startDate: new Date('2021-01-10'), time: '6pm - 10pm', location: "Rak'tika Greatwood", description: 'A certificate that shows you are trained with amaros', cost: 500, gradingFormat: 'pass/fail', typeOfEvent: 'certificate', justification: 'Certificate allows you to attend special amaro related classes', rejected: false, status: 'Need DS approval', involvedUsers: ['teacle@crystarium.net'] });
}
