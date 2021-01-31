import { SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { changeForm, getUserForms } from "../actions";
import { formState, UserState } from "../reducer";
import formService from "./form.service";

function MoreInfo(){
    const history = useHistory();
    const formSelector = (state: formState) => state.form;
    const form = useSelector(formSelector);
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const dispatch = useDispatch();


    function handleFormInput(e:SyntheticEvent){
        let f: any = {...form};
        f.justificationForRejection = (e.target as HTMLTextAreaElement).value;
        dispatch(changeForm(f));
    }

    function submitForm(){
        formService.updateForm(form).then(()=>{
            dispatch(changeForm(form));
            formService.getUserForms(user.username).then((userForms)=>{
                dispatch(getUserForms(userForms))
                history.push('/forms');
            })
            
        });
    }
    
    return(
        <div className = 'form'>
            <h2>Form Rejection</h2>
            Form ID <input className='form-control'type='text' value= {form.id} readOnly></input>
            <br/>
            Reason for Rejection <textarea className='form-control' onChange={handleFormInput} name='justificationForRejection'></textarea>
            <button  className='btn btn-block submitbtn' onClick={submitForm}>Submit</button>
        </div>
        
    )
}

export default MoreInfo;