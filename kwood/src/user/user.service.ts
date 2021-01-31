import logger from '../log';
import docClient from '../dynamo/dynamo';
import { User } from './user';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';

class UserService {
    private doc: DocumentClient;
    constructor() {
        // The documentClient. This is our interface with DynamoDB
        this.doc = dynamo; // We imported the DocumentClient from dyamo.ts
    }

    
    //CRUD: Create; add user to database
    async addUser(user: User): Promise<boolean> {
        const params = {
            TableName: 'users',
            Item: user,
            ConditionExpression: '#username <> :username',
            ExpressionAttributeNames: {
                '#username': 'username',
            },
            ExpressionAttributeValues: {
                ':username': user.username
                ,
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

    //CRUD: read
    async getUserByUsername(username: string): Promise<User | null> {
        // GetItem api call allows us to get something by the key
        const params = {
            TableName: 'users',
            Key: {
                'username':username
            }
        };
        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                return data.Item as User;
            } else {
                return null;
            }
        })
    }
    //CRUD: Read; get all users from database
    async getUsers(): Promise<User[]> {
        const params = {
            TableName: 'users'
        };
        return await this.doc.scan(params).promise().then((data) => {
            return data.Items as User[];
        })
    }

    //CRUD: Update
    async updateUser(user: User) {
        const params = {
            TableName: 'users',
            Key: {
                'username': user.username
            },
            UpdateExpression: 'set password = :p, superior = :s, tuitionReimbursement = :t, #position = :po, pendingReimbursements = :pr, awardedReimbursements = :ar',
            ExpressionAttributeNames:{
                '#position': 'position'

            },
            ExpressionAttributeValues: {
                ':p': user.password,
                ':s': user.superior,
                ':t': user.tuitionReimbursement,
                ':po': user.position,
                ':pr': user.pendingReimbursements,
                ':ar': user.awardedReimbursements
            },
            ReturnValues: 'UPDATED_NEW'
        };
        return await this.doc.update(params).promise().then((data) => {
            logger.debug(' in user service, update user:' + data);
            return true;
        }).catch(error => {
            logger.error(error);
            return false;
        });
    }

    //CRUD: Delete is not going to be needed in this application
}
const userService = new UserService();
export default userService;
