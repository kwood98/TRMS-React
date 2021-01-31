import { SyntheticEvent, useEffect } from 'react';
import userService from './user.service';
import { useHistory } from 'react-router-dom';
import { UserState } from '../reducer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserForms, getUser, loginAction, getAllForms, getViewableForms, setSupervisor } from '../actions';
import formService from '../form/form.service';
import { Form } from '../form/form';

// Function Component
function LoginComponent() {
    const userSelector = (state: UserState) => state.loginUser;
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const history = useHistory();

    function handleFormInput(e: SyntheticEvent) {
        let u: any = { ...user };
        if ((e.target as HTMLInputElement).name === 'username') {
            u.username = (e.target as HTMLInputElement).value;
        } else {
            u.password = (e.target as HTMLInputElement).value;
        }
        dispatch(loginAction(u));

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


    function submitForm() {
        userService.login(user).then((user) => {
            dispatch(getUser(user));
            formService.getUserForms(user.username).then((forms) => {
                dispatch(getUserForms(forms));
            })

            /* formService.getAllForms().then((forms) => {
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


                userService.getUserByName(user.superior).then((sup) => {
                    dispatch(setSupervisor(sup));
                })
            }) */
            dispatch(getViewableForms([]))

        }).catch(err => {
            alert('Invalid User');
            console.log(err);
        });

        history.push('/');
    }
    return (

        <div className='col loginForm'>
            Username <input type='text' className='form-control' onChange={handleFormInput} name='username' />
            <br />
           Password <input type='password' className='form-control' onChange={handleFormInput} name='password' />
            <br />
            <button className='btn loginbtn' onClick={submitForm}>Login</button>
        </div>
    );
}

export default LoginComponent;
