import { SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { changeForm, getAllForms, getViewableForms } from "../actions";
import { formState, UserState } from "../reducer";
import userService from "../user/user.service";
import { Form } from "./form";
import formService from "./form.service";

function ModifyForm(){
    const history = useHistory();
    const formSelector = (state: formState) => state.form;
    const form = useSelector(formSelector);
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const dispatch = useDispatch();

    function handleFormInput(e:SyntheticEvent){
        let f: any = { ...form };
        f[
            (e.target as HTMLInputElement).name
        ] = (e.target as HTMLInputElement).value;
        dispatch(changeForm(f));
    }
    async function getViewForms(item: Form): Promise<Boolean>{
        let isViewable = false;
        if (item.rejected == false) {
            console.log('is true')
            console.log(user)
            
            //if user is already involved in form
              await userService.getUserByName(item.username).then(async (formUser) => {
                await userService.getUserByName(user.username).then((user)=>{
                    console.log(user.position.includes('BenCo'))
                    console.log(item.status)
                    if (item.involvedUsers.includes(user.username)&& item.username != user.username) {
                        console.log('involved user')
                        isViewable = true;
    
                        //if form needs DH approval and user is a Dh
                    } else if (user.position.includes('Department Head') && item.status == 'Needs DH approval' && item.username != user.username) {
                        console.log('is dh')
                        isViewable = true;
                        //if form needs DS approval and user is DS    
                        
                    } else if(user.position.includes('Department Head') && item.status == 'Needs DS approval' && item.username != user.username){
                        console.log('is dh')
                        isViewable = true;
                    }else if (formUser.superior == user.username) {
                        console.log('is superior')
                        isViewable = true;
    
                        //if form needs BenCo and user is BenCo
                    } else if (user.position.includes('BenCo') && item.status == 'Needs BenCo approval' && item.username != user.username) {
                        console.log('is benco')
                        isViewable = true;
                    }
                    return isViewable;
                 })
                
            })

        }
        return isViewable;
        
    }
    function submitForm(){
        form.modified = true;
        form.status = 'Approved - Benco Modified'
        form.involvedUsers.push(user.username)
        formService.updateForm(form).then(()=>{
            dispatch(changeForm(form));
            formService.getAllForms().then((forms) => {
                dispatch(getAllForms(forms));
                let viewableForms: Form[] = [];
                forms.forEach(async (item) => {
                    if(item.rejected == false){
                        if(await getViewForms(item)){
                            viewableForms.push(item);
    
                        }

                    }
                    
                })
                console.log(viewableForms)
                dispatch(getViewableForms(viewableForms));

            history.push('/forms')

        })


    })
}

    return(
        <div className = 'form'>
            <h2>Form Modification</h2>
            <p> You can only modify the amount awarded for the form.</p><br/>
            Form ID <input readOnly type='text' className='form-control' value={form.id} />
            Event Cost <input readOnly type='text' className='form-control' value={form.cost} />
            Event Type <input readOnly type='text' className='form-control' value={form.typeOfEvent} />
            Estimated Reimbursement <input readOnly type='text' className='form-control' value={form.estimatedReimbursement} />
            To Be Awarded Reimbursement <input onChange={handleFormInput} type='number' className='form-control' name='toBeAwarded' />
            Justification for Modification <input onChange={handleFormInput} type='text' className='form-control' name='justificationForModification' />
            <button  className='btn btn-block submitbtn' onClick={submitForm}>Submit</button>
        </div>
        
    )
}

export default ModifyForm;