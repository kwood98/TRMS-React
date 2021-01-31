import { SyntheticEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { changeForm, getAllForms, getViewableForms } from "../actions";
import { formState, UserState } from "../reducer";
import userService from "../user/user.service";
import { Form } from "./form";
import formService from "./form.service";

function RejectForm() {
    const history = useHistory();
    const formSelector = (state: formState) => state.form;
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const form = useSelector(formSelector);
    const dispatch = useDispatch();

    function handleFormInput(e: SyntheticEvent) {
        let f: any = { ...form };
        f.justificationForRejection = (e.target as HTMLTextAreaElement).value;
        dispatch(changeForm(f));
    }

    useEffect(() => {
        console.log('in use effect reject')
        formService.getAllForms().then((allForms) => {
            let viewableForms: Form[] = [];
            allForms.forEach((item) => {
                if (item.rejected == false) {
                    //if user is already involved in form
                    userService.getUserByName(item.username).then((formUser) => {
                        if (item.involvedUsers.includes(user.username) && item.username != user.username) {
                            viewableForms.push(item);
                            //if form needs DH approval and user is a Dh
                        } else if (user.position.includes('Department Head') && item.status == 'Needs DH approval' && item.username != user.username) {
                            viewableForms.push(item);

                            //if form needs DS approval and user is DS    
                        } else if (user.position.includes('Department Head') && item.status == 'Needs DS approval' && item.username != user.username) {
                            viewableForms.push(item);
                        }
                        else if (formUser.superior == user.username) {
                            viewableForms.push(item);

                            //if form needs BenCo and user is BenCo
                        } else if (user.position.includes('BenCo') && item.status == 'Needs BenCo approval' && item.username != user.username) {
                            viewableForms.push(item);

                        }

                    })

                }
            })
            console.log(viewableForms);
            dispatch(getViewableForms(viewableForms));
            
        })

    }, [form.rejected])

    function submitForm() {

        form.rejected = true;
        form.status = 'Rejected';
        form.involvedUsers.push(user.username);
        formService.updateForm(form).then(() => {
            dispatch(changeForm(form));

        });

        userService.getUserByName(form.username).then((user) => {
            user.pendingReimbursements -= form.estimatedReimbursement;
            userService.updateUser(user);
            formService.getAllForms().then((allForms) => {
                dispatch(getAllForms(allForms));
                let viewableForms: Form[] = [];
                allForms.forEach((item) => {
                    if (item.rejected == false) {
                        //if user is already involved in form
                        userService.getUserByName(item.username).then((formUser) => {
                            if (item.involvedUsers.includes(user.username) && item.username != user.username) {
                                viewableForms.push(item);
                                //if form needs DH approval and user is a Dh
                            } else if (user.position.includes('Department Head') && item.status == 'Needs DH approval' && item.username != user.username) {
                                viewableForms.push(item);

                                //if form needs DS approval and user is DS    
                            } else if (user.position.includes('Department Head') && item.status == 'Needs DS approval' && item.username != user.username) {
                                viewableForms.push(item);
                            } else if (formUser.superior == user.username) {
                                viewableForms.push(item);

                                //if form needs BenCo and user is BenCo
                            } else if (user.position.includes('BenCo') && item.status == 'Needs BenCo approval' && item.username != user.username) {
                                viewableForms.push(item);
                            }

                        })

                    }
                })
                dispatch(getViewableForms(viewableForms));
                history.push('/forms');
            })


        })




    }

    return (
        <div className='form'>
            <h2>Form Rejection</h2>
            Form ID <input className='form-control' type='text' value={form.id} readOnly></input>
            <br />
            Reason for Rejection <textarea className='form-control' onChange={handleFormInput} name='justificationForRejection'></textarea>
            <button className='btn btn-block submitbtn' onClick={submitForm}>Submit</button>
        </div>

    )
}

export default RejectForm;