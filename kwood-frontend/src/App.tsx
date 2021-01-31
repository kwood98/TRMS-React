import React, { useState, useEffect } from 'react';
import './App.css';
import RouterComponent from './routing.component';
import userService from './user/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { getAllForms, getUser, getUserForms, setSupervisor } from './actions';
import formService from './form/form.service';
import { User } from './user/user';
import { UserState } from './reducer';
import { Form } from './form/form';

function App() {
  const [cond, setCond] = useState(true);

  const dispatch = useDispatch();

  const userSelector = (state: UserState) => state.user;
  const user = useSelector(userSelector);

  
  useEffect(() => {
    userService.getLogin().then((user) => {
      dispatch(getUser(user));
    })
  }, [dispatch]);

 useEffect(() => {
    formService.getAllForms().then((forms) => {
      dispatch(getAllForms(forms));
    })
  }, [dispatch]); 

  useEffect(()=>{
    formService.getUserForms(user.username).then((form) => {
      console.log('in getForm in app '+ user.username)
      dispatch(getUserForms(form));
  })
  }, [dispatch]); 
  



  return (
    <div className='container'>
      <RouterComponent></RouterComponent>
    </div>
  );
}

export default App;
