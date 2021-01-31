import React from 'react';
import { Route, BrowserRouter, Link, Redirect, useHistory, } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './actions';
import { UserState } from './reducer';
import { User } from './user/user';
import userService from './user/user.service';
import LoginComponent from './user/login.component';
import HomeComponent from './home.component';
import FormComponent from './form/form.component';
import TableComponent from './form/table.component';
import FormDetailComponent from './form/formdetail.component';
import AboutComponent from './about.component';
import CreateFormComponent from './form/create-form.component';
import rejectForm from './form/rejectForm.component';
import acceptForm from './form/acceptForm.component';
import modifyForm from './form/modifyForm.component';
import moreInfo from './form/moreInfo.component';


export default function RouterComponent() {
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const history = useHistory();

    function logout() {
        userService.logout().then(() => {
            dispatch(getUser(new User()));
        });
    }
    return (
        <BrowserRouter>
            <div>
                <header>
                    <h1>Garlond Ironworks</h1>
                    <nav id='nav'>
                        <ul>
                            <li>
                                <Link to='/'>Home</Link>
                            </li>
                            {user.username && (
                                < li >
                                    <Link to='/forms'>
                                        View Forms
                                    </Link>
                                </li>

                            )}
                            {user.username && (
                                < li >
                                    <Link to='/create'>
                                        Create New Form
                                    </Link>
                                </li>

                            )}
                            <li>
                                <Link to='/about'>About</Link>
                            </li>
                            {/*  <li>
                                <Link to='/contact'>Contact</Link>
                            </li> */}
                            <li>
                                {user.username ? (
                                    <button className='link' onClick={logout}>
                                        <Link to='/'>Logout</Link>
                                    </button>

                                ) : (
                                        <Link to='/login'>Login</Link>
                                    )}
                            </li>

                        </ul>
                    </nav>
                </header>
                <Route exact path='/login' component={LoginComponent} />
                <Route exact path='/' component={HomeComponent} />
                <Route exact path='/forms' component={TableComponent} />
                <Route exact path='/forms/:id' component={FormDetailComponent} />
                <Route exact path='/about' component={AboutComponent} />
                <Route exact path='/create' component={CreateFormComponent} />
                <Route exact path = '/reject' component = {rejectForm}/>
                <Route exact path = '/accept' component = {acceptForm}/>
                <Route exact path = '/modify' component = {modifyForm}/>
                <Route exact path = '/more' component = {moreInfo}/>
            </div>
        </BrowserRouter >
    );
}