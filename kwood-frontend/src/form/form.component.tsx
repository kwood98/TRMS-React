import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { formState, UserState } from '../reducer';
import { Form } from './form'


interface FormProps {
    data: Form;
}

function FormComponent(props: FormProps) {

    if (props.data.rejected == true) {
        return (
            <tr className='table-danger'>
                <td >{props.data.id}</td>
                <td >{props.data.name}</td>
                <td>{props.data.startDate}</td>
                <td>{props.data.typeOfEvent}</td>
                <td>{props.data.cost}</td>
                <td>{props.data.status}</td>
                <td> <Link to={`/forms/${props.data.id}`}>
                    {' '}
            See more info{' '}
                </Link> </td>
            </tr>
        );

    } else {
        if (props.data.urgent == true) {
            return (

                <tr className = 'table-warning'>
                    <td >{props.data.id}</td>
                    <td >{props.data.name}</td>
                    <td>{props.data.startDate}</td>
                    <td>{props.data.typeOfEvent}</td>
                    <td>{props.data.cost}</td>
                    <td>{props.data.status}</td>
                    <td> <Link to={`/forms/${props.data.id}`}>
                        {' '}
                See more info{' '}
                    </Link> </td>
                </tr>
            );
        } else if(props.data.status == 'Approved - Benco Modified') {
            return (

                <tr className = 'table-light'>
                    <td >{props.data.id}</td>
                    <td >{props.data.name}</td>
                    <td>{props.data.startDate}</td>
                    <td>{props.data.typeOfEvent}</td>
                    <td>{props.data.cost}</td>
                    <td>{props.data.status}</td>
                    <td> <Link to={`/forms/${props.data.id}`}>
                        {' '}
                See more info{' '}
                    </Link> </td>
                </tr>
            );
        }
        else{
            return (

                <tr>
                    <td >{props.data.id}</td>
                    <td >{props.data.name}</td>
                    <td>{props.data.startDate}</td>
                    <td>{props.data.typeOfEvent}</td>
                    <td>{props.data.cost}</td>
                    <td>{props.data.status}</td>
                    <td> <Link to={`/forms/${props.data.id}`}>
                        {' '}
                See more info{' '}
                    </Link> </td>
                </tr>
            );
        }

    }

}

export default FormComponent;