import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';
import logger from '../log';
import userService from '../user/user.service';
import { Form } from './form';

class FormService {

    private doc: DocumentClient;
    constructor() {
        // The documentClient. This is our interface with DynamoDB
        this.doc = dynamo; // We imported the DocumentClient from dyamo.ts
    }

    //CRUD: Create
    async addForm(form: Form): Promise<boolean> {


        //Lets deal with whether or not the form is rejected based off of when the form is submitted (which is the current date)
        let today = new Date();
        var startDate = new Date(form.startDate);

        //start Date is before this year
        if (startDate.getFullYear() < today.getFullYear()) {
            form.rejected = true;
            form.status = 'Rejected';
            form.submitDate = today.toLocaleDateString();
            form.justificationForRejection = "Form submitted too late, must be submitted atleast one week prior to event start."
            form.urgent = false;
            //start date is on or after this year
        } else {
            //if form is submitted within same month of start date
            if (startDate.getMonth() == today.getMonth()) {
                //if form is submitted > one week before start date
                if ((startDate.getDate() - 7) > (today.getDate())) {
                    form.rejected = false;
                    form.status = 'Needs DS approval';
                    form.submitDate = today.toLocaleDateString();
                    if((startDate.getDate()-14) < (today.getDate())){
                        form.urgent = true;
                    }else{
                        form.urgent = false;
                    }
        
                 //if form is submitted after one week of start date
                } else {
                    form.rejected = true;
                    form.status = 'Rejected';
                    form.submitDate = today.toLocaleDateString();
                    form.justificationForRejection = "Form submitted too late, must be submitted atleast one week prior to event start.";
                    form.urgent = false;
                }

            //if form is submitted after month
            } else if (startDate.getMonth() < today.getMonth()) {
                
                form.rejected = true;
                form.justificationForRejection = "Form submitted too late, must be submitted atleast one week prior to event start.";
                form.status = 'Rejected';
                form.submitDate = today.toLocaleDateString();
                form.urgent = false;

                //if form is submitted before start month
            } else if (startDate.getMonth() > today.getMonth()) {

                //if form is submitted only one month out
                if ((startDate.getMonth()-1) == today.getMonth() ) {
                    //get the day a week before start date
                    let weekBefore = startDate.getDate() - 7;
                    let twoWeekBefore = startDate.getDate() -14;
                    let dayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

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
                            if(today.getDate() > (dayPrevMonth + twoWeekBefore)){
                                form.urgent = true;
                            }

                        }//else form is submitted in time and we don't want to do anything


                        //if weekBefore is positive (week before start is in this month)
                    } else {
                        //form submitted after the submission deadline
                        if ( weekBefore < today.getDate()) {
                            form.rejected = true;
                            form.justificationForRejection = "Form submitted too late, must be submitted atleast one week prior to event start.";
                            form.status = 'Rejected';
                            form.submitDate = today.toLocaleDateString();
                            form.urgent = false;
                            //else form is submitted within deadline
                        } else {
                            form.rejected = false;
                            form.status = 'Needs DS approval'
                            form.submitDate = today.toLocaleDateString();
                            form.urgent = false;
                        }
                    }
                    //if form is submitted more than one month out we want to do nothing
                } else {
                    form.rejected = false;
                    form.status = 'Needs DS approval'
                    form.submitDate = today.toLocaleDateString();
                    form.urgent = false;
                }
            }
        }
        setTimeout(() => {
            //lets find out the estimated reimbursement
            let estimatedReimbursement = 0;
            userService.getUserByUsername(form.username).then((user) => {
                if (user) {
                    form.DS = user.superior;
                    let availableReimbursement = user.tuitionReimbursement - user.awardedReimbursements - user.pendingReimbursements
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
                    } else {
                        form.estimatedReimbursement = estimatedReimbursement;
                    }
                    formService.updateForm(form);
                    //only update user if form is not rejected
                    if (form.rejected == false) {
                        user.pendingReimbursements += Number(form.estimatedReimbursement);
                        userService.updateUser(user);
                    }
                }
            })
        }, 5000)
        form.toBeAwarded = 0;
        form.awardedReimbursement = 0;

        const params = {
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
        return await this.doc.put(params).promise().then((result) => {
            logger.info('Successfully created item');
            return true;
        }).catch((error) => {
            logger.error(error);
            return false;
        });
    }


    //get all forms
    async getAllForms(): Promise<Form[] | []> {
        const params = {
            TableName: 'forms',
        };

        return await this.doc.scan(params).promise().then((data) => {
            if (data) {
                return data.Items as Form[];
            } else {
                return [];
            }
        });
    }

    //CRUD: Read; get a form by id
    async getFormByID(id: number): Promise<Form | null> {
        const params = {
            TableName: 'forms',
            Key: {
                'id': id,
            }
        }
        return await this.doc.get(params).promise().then((data) => {

            return data.Item as Form;
        }).catch((err) => {
            logger.error(err);
            return null;
        })
    }

    //CRUD: Read, get forms by user
    async getFormsByUser(username: string): Promise<Form[] | []> {
        const params = {
            TableName: 'forms',
            FilterExpression: '#username = :username',
            ExpressionAttributeNames: {
                '#username': 'username'
            },
            ExpressionAttributeValues: {
                ':username': username
            }
        };

        return await this.doc.scan(params).promise().then((data) => {
            if (data) {
                return data.Items as Form[];
            } else {
                return [];
            }
        });
    }



    //CRUD: Update
    async updateForm(form: Form) {
        const params = {
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
        return await this.doc.update(params).promise().then((data) => {
            logger.info('Successfully updated item')
            return true;
        }).catch(error => {
            logger.error(error);
            return false;
        });

    }

    //CRUD: Delete
    async removeForm(form: Form): Promise<boolean> {
        const params = {
            TableName: 'forms',
            Key: {
                'id': form.id
            }
        };
        return await this.doc.delete(params).promise().then((result => {
            return true;
        })).catch((error) => {
            logger.error(error);
            return false;
        });
    }

}

const formService = new FormService();
export default formService;