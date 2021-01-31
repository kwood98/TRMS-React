import * as Actions from './actions';
import { Form } from './form/form';
import { User } from './user/user';


// Define the items that are in our state
export interface formState {
    allForms: Form[];
    userForms: Form[];
    viewableForms:Form[];
    form: Form;
}
export interface UserState {
    user: User;
    loginUser: User;
    supervisor: User;
}
export interface AppState extends UserState, formState { }


const initialState: AppState = {
    user: new User(),
    loginUser: new User(),
    supervisor: new User(),
    allForms: [],
    userForms: [],
    viewableForms:[],
    form: new Form()
}


const reducer = (state: AppState = initialState, action: Actions.AppAction): AppState => {
    // We want to call setState. (redux will do that when we return a new state object from the reducer)
    const newState = { ...state }; // If we return this, it will re render the application. (call setState)

    switch (action.type) {
        case Actions.FormActions.GetUserForms:
            newState.userForms = action.payload as Form[];
            return newState;
        case Actions.FormActions.GetAllForms:
            newState.allForms = action.payload as Form[];
            return newState;
        case Actions.FormActions.GetViewableForms:
            newState.viewableForms = action.payload as Form[];
            return newState;
        case Actions.FormActions.ChangeForm:
            newState.form = action.payload as Form;
            return newState; 
        case Actions.UserActions.GetUser:
            newState.user = action.payload as User;
            return newState;
        case Actions.UserActions.SetSupervisor:
            newState.supervisor = action.payload as User;
            return newState;
        case Actions.UserActions.LoginChange:
            newState.loginUser = action.payload as User;
            return newState;
        default:
            return state;
    }
}

export default reducer;