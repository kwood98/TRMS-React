import axios from 'axios';
import { Form } from './form';
import { UserState } from '../reducer';
import { useSelector } from 'react-redux';

class FormService {
    private URI: string;
    constructor() {
        // URL of the express server
        this.URI = 'http://localhost:3000/forms';
    }

    getUserForms(username:string): Promise<Form[]> {
        console.log('in getForms of form.service' + this.URI + '/' + username);
        return axios.get(this.URI + '/' + username).then(result => result.data);
    }

    getFormByID(id:number): Promise<Form>{
        return axios.get(this.URI + '/' + id).then(result => result.data);
    }

    createForm(f:Form): Promise<null>{
        return axios.post(this.URI,f).then(result => null);
    }

    getAllForms():Promise<Form[]>{
        return axios.get(this.URI).then(result => result.data);
    }

    updateForm(f:Form): Promise<null>{
        return axios.put(this.URI,f).then(result => null);
    }


}
export default new FormService();