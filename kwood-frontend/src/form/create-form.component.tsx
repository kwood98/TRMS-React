import { SyntheticEvent, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeForm, getAllForms, getUser, getUserForms, getViewableForms } from '../actions';
import { formState, UserState } from '../reducer';
import { Form } from './form'
import formService from './form.service';
import { isPropertySignature } from 'typescript';
import userService from '../user/user.service';



function CreateFormComponent() {
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);

    const selectForms = (state: formState) => state.allForms;
    const allForms = useSelector(selectForms);

    const selectForm = (state: formState) => state.form;
    const form = useSelector(selectForm);

    const selectUserForm = (state: formState) => state.userForms;
    const userForms = useSelector(selectUserForm);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(()=>{
        formService.getAllForms().then((forms)=>{
            dispatch(getAllForms(forms));
        })
        userService.getUserByName(user.username).then((user)=>{
            dispatch(getUser(user));
        })

    },[allForms])

    




    function handleFormInput(e: SyntheticEvent) {
        let f: any = { ...form };
        if (f.id == 0 || f.id == allForms.length) {
            f.id = allForms.length + 1;
            f.username = user.username;
            f.status = 'Needs DS approval'
            f.submitDate = new Date().toLocaleDateString
            f.involvedUsers.push(user.username);
            form.rejected = false;
        }

        f[
            (e.target as HTMLInputElement).name
        ] = (e.target as HTMLInputElement).value;
        dispatch(changeForm(f));
    }

    function submitForm() {

        let e = document.getElementById('gradingFormat') as HTMLInputElement;
        form.gradingFormat = e.value;

        let v = document.getElementById('typeOfEvent') as HTMLInputElement;
        form.typeOfEvent = v.value;

        formService.createForm(form).then(() => {
            console.log(form)

            dispatch(changeForm(new Form()));
            formService.getAllForms().then((allForms) => {
                dispatch(getAllForms(allForms));
                let viewableForms: Form[] = [];
                allForms.forEach((item) => {
                    if (item.rejected == false) {
                        //if user is already involved in form
                        userService.getUserByName(item.username).then((formUser) => {
                            if (item.involvedUsers.includes(user.username)&& item.username != user.username) {
                                viewableForms.push(item);
                                //if form needs DH approval and user is a Dh
                            } else if (user.position.includes('Department Head') && item.status == 'Needs DH approval' && item.username != user.username) {
                                viewableForms.push(item);

                                //if form needs DS approval and user is DS    
                            } else if (formUser.superior == user.username) {
                                viewableForms.push(item);

                                //if form needs BenCo and user is BenCo
                            } else if (user.position.includes('BenCo') && item.status == 'Needs BenCo approval' && item.username != user.username) {
                                viewableForms.push(item);
                            }

                        })

                    }
                })
                console.log(viewableForms)
                dispatch(getViewableForms(viewableForms))
                formService.getUserForms(user.username).then((userForms) => {
                    dispatch(getUserForms(userForms));
    
                })
                userService.getUserByName(user.username).then((user)=>{
                    dispatch(getUser(user));
                    history.push('/forms');
    
                })
                
            })
            
            
        });


    }


    return (
        <div className='form-group addForm'>
            <h3>Fill out the following and hit submit to create a new tuition reimbursment form</h3>
            Name <input onChange={handleFormInput} type='text' className='form-control' name='name' />
            Start Date <input onChange={handleFormInput} type='date' className='form-control' name='startDate' />
            Time Event Occurs <input onChange={handleFormInput} type='text' className='form-control' name='time' />
            Location of Event <input onChange={handleFormInput} type='text' className='form-control' name='location' />
            Description of Event <input onChange={handleFormInput} type='text' className='form-control' name='description' />
            Type of Event
            <select onChange={handleFormInput} className='form-control' id='typeOfEvent' name='typeOfEvent' defaultValue='University Course'>
                <option value='University Course' >University Course</option>
                <option value='Seminar'>Seminar</option>
                <option value='Certification Preperation Class'>Certification Preperation Class</option>
                <option value='Certification'>Certification</option>
                <option value='Technical Training'>Technical Training</option>
                <option value='Other'>Other</option>
            </select>
            Cost of Event <input onChange={handleFormInput} type='number' className='form-control' name='cost' />
            Grading Format
            <select onChange={handleFormInput} className='form-control' id='gradingFormat' name='gradingFormat' defaultValue='Pass/Fail'>
                <option value='Pass/Fail' >Pass/Fail</option>
                <option value='Traditional'>Traditional</option>
                <option value='Other'>Other</option>
            </select>
            Justification for Reimbursement <input onChange={handleFormInput} type='text' className='form-control' name='justificationForEvent' />
            <button className='btn btn-block submitbtn' onClick={submitForm}>Submit</button>
        </div>
    )

}

export default CreateFormComponent;