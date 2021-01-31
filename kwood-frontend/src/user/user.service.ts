import axios from 'axios';
import { User } from './user';

class UserService {
    private URI: string;
    constructor() {
        // URL of the express server
        this.URI = 'http://localhost:3000/users';
    }
    getLogin(): Promise<User> {
        return axios.get(this.URI, {withCredentials: true}).then(result=>{
            return result.data
        });
    }

    getUserByName(name: string): Promise<User>{
        return axios.get(this.URI + '/' + name).then(result => result.data);
    }

    updateUser(user:User):Promise<null>{
        return axios.put(this.URI,user).then(reulst => null);
    }

    
    login(user: User): Promise<User> {
        return axios.post(this.URI, user, {withCredentials: true}).then(result => result.data);
    }
    logout(): Promise<null> {
        return axios.delete(this.URI, {withCredentials: true}).then(result => null);
    }
}

export default new UserService();