import {Form} from './form/form';
import {User} from './user/user';

export enum FormActions {
    GetUserForms = 'GET_USER_FORMS',
    GetAllForms = 'GET_ALL_FORMS',
    ChangeForm = 'CHANGE_FORM',
    GetViewableForms='GET_VIEWABLE_FORMS'

   
}

export enum UserActions {
    GetUser = 'GET_USER',
    LoginChange = 'CHANGE_LOGIN',
    SetSupervisor = 'SET_SUPERVISOR'
}

export interface AppAction {
    type: string;
    payload: any;
}

export interface UserAction extends AppAction {
    type: UserActions;
    payload: User;
}

export interface FormAction extends AppAction {
    type: FormActions;
    payload: Form | Form[];
}
export function getViewableForms(forms: Form[]): FormAction {
    const action: FormAction = {
        type: FormActions.GetViewableForms,
        payload: forms
    }
    return action;
}


export function getAllForms(forms: Form[]): FormAction {
    const action: FormAction = {
        type: FormActions.GetAllForms,
        payload: forms
    }
    return action;
}
export function getUserForms(forms: Form[]): FormAction {
    const action: FormAction = {
        type: FormActions.GetUserForms,
        payload: forms
    }
    return action;
}

export function changeForm(form:Form):FormAction{
    const action: FormAction = {
        type: FormActions.ChangeForm,
        payload: form
    }
    return action;
}

export function getUser(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.GetUser,
        payload: user
    }
    return action;
}


export function setSupervisor(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.SetSupervisor,
        payload: user
    }
    return action;
}

export function loginAction(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.LoginChange,
        payload: user
    }
    return action;
}