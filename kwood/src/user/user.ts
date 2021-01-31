import logger from '../log';
import userService from './user.service';

export class User{
    username = '';
    password ='';
    superior ='';
    tuitionReimbursement =1000;
    position: String[] = [];
    pendingReimbursements = 0;
    awardedReimbursements = 0;

}

export async function login(username: string, password: string): Promise<User|null> {
    logger.debug(`in login: ${username +' '+ password}`);
    return await userService.getUserByUsername(username).then((user)=> {
        if (user && user.password === password) {
            return user;
        } else {
            return null;
        }
    })
}

/* export function register(email: string, password: string, tuitionReimbursmentAvailable: number, position:string[], callback: Function) {
    userService.addUser(new User(email, password, tuitionReimbursmentAvailable, position, 'Customer')).then((res) => {
        logger.trace(res);
        callback();
    }).catch((err) => {
        logger.error(err);
        console.log('Error, this probably means that the username is already taken.')
        callback();
    });
} */

export function updateUser(user: User) {
    userService.updateUser(user).then((success) => {
        logger.info('user updated successfully');
    }).catch((error) => {
        logger.warn('user not updated');
    });
}
