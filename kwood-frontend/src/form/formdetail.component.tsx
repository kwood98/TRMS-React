import { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeForm, getAllForms, getUser, getUserForms, getViewableForms } from '../actions';
import { formState, UserState } from '../reducer';
import { Form } from './form'
import formService from './form.service';
import { User } from '../user/user';
import userService from '../user/user.service';
import FormComponent from './form.component';

interface FormDetailProps {
    match: any;
}

export default function FormDetailComponent(
    props: FormDetailProps
) {
    const history = useHistory();
    const formSelector = (state: formState) => state.form;
    const form = useSelector(formSelector);
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        formService.getFormByID(props.match.params.id).then((form) => {
            console.log('in useEffect form.service: ' + form.id);
            dispatch(changeForm(form));
        })
    }, [dispatch, props.match.params.id]);

    useEffect(()=>{
        formService.getUserForms(user.username).then((userForms)=>{
            dispatch(getUserForms(userForms))
        })

    },[form])

    //conditional testing if buttons should be dipslayed
    function displayButtons() {
        if (form.status == 'Needs DS approval' && form.DS == user.username && form.username != user.username) {
            return buttons();
        }

        if (form.status == 'Needs DS approval' && user.position.includes('Department Head') && form.username != user.username) {
            return buttons();
        }

        if (form.status == 'Needs DH approval' && user.position.includes('Department Head') && form.username != user.username) {
            return buttons();
        }

        if (form.status == 'Needs BenCo approval' && user.position.includes('BenCo') && form.username != user.username) {
            return buttons();
        }

        if (form.status == 'Approved - Benco Modified' && form.username == user.username) {
            return buttons();
        }

    }
    function handleAccept() {
        // if user is department head, skip needing department head approval
        if (form.status == 'Needs DS approval' && user.position.includes('Department Head')) {
            form.status = 'Needs BenCo approval';
            form.involvedUsers.push(user.username);
            //else if user is DS, NOTE: the use can't even get to this page unless they are n a position where they are allowed to accept/deny form
        } else if (form.status == 'Needs DS approval') {
            form.status = 'Needs DH approval';
            form.involvedUsers.push(user.username);
        } else if (form.status == 'Needs DH approval') {
            form.status = 'Needs BenCo approval'
            form.involvedUsers.push(user.username);
        } else if (form.status == 'Needs BenCo approval') {
            console.log('is benco')
            form.status = 'Accepted - pending grade'
            form.involvedUsers.push(user.username);
            form.toBeAwarded = form.estimatedReimbursement;
        } else if (form.status == 'Approved - Benco Modified') {
            form.status = 'Accepted - pending grade'
            formService.getUserForms(user.username).then((forms) => {
                dispatch(getUserForms(forms));
            })
        }
        formService.updateForm(form).then((newForm) => {
            dispatch(changeForm(form));
        })


        history.push('/accept')

    }

    function handleReject() {
        history.push('/reject')

    }
    function handleModify() {
        history.push('/modify')
    }

    //buttons to be displayed(accpet, reject, ask for more info)
    function buttons() {
        return (
            <div className='buttonDiv'>
                <button className='btn formbtn' onClick={handleAccept}> Accept Form</button>
                <button className='btn formbtn' onClick={handleReject}> Reject Form</button>
                {user.position.includes('BenCo') && (
                    <button className='btn formbtn' onClick={handleModify}> Modify Form</button>
                )}
                {(form.status != 'Approved - Benco Modified') && (
                    <button className='btn formbtn' onClick={handleAskForMoreInfo}> Ask for more information</button>
                )}

            </div>
        )
    }
    function handleAskForMoreInfo() {
        history.push('/more');

    }
    if (form.rejected == true) {
        return (
            <div className='form'>
                <table className='table table-danger'>
                    <tr><th>Form ID:</th> <td>{form.id}</td></tr>
                    <tr><th>Name:</th> <td>{form.name}</td></tr>
                    <tr><th>Email:</th> <td>{form.username}@garlondIronworks.com</td></tr>
                    <tr><th>Start Date:</th> <td>{form.startDate}</td></tr>
                    <tr><th>Event Time:</th> <td>{form.time}</td></tr>
                    <tr><th>Location:</th> <td>{form.location}</td></tr>
                    <tr><th>Cost:</th> <td>{form.cost}</td></tr>
                    <tr><th>Estimated Reimbursement:</th> <td>{form.estimatedReimbursement}</td></tr>
                    <tr><th>Type of Event:</th> <td>{form.typeOfEvent}</td></tr>
                    <tr><th>Grading Format:</th> <td>{form.gradingFormat}</td></tr>
                    <tr><th>Justification:</th> <td>{form.justificationForEvent}</td></tr>
                    <tr><th>Status:</th> <td>{form.status}</td></tr>
                    <tr><th>Reason for Rejection: </th> <td>{form.justificationForRejection}</td></tr>

                </table>
            </div>
        );
    } else if (form.status == 'Approved - Benco Modified') {
        return (
            <div className='form'>
                <table className='table table-light table-primary table-sm table-bordered'>
                    <tr><th>Form ID:</th> <td>{form.id}</td></tr>
                    <tr><th>Name:</th> <td>{form.name}</td></tr>
                    <tr><th>Email:</th> <td>{form.username}@garlondIronworks.com</td></tr>
                    <tr><th>Start Date:</th> <td>{form.startDate}</td></tr>
                    <tr><th>Event Time:</th> <td>{form.time}</td></tr>
                    <tr><th>Location:</th> <td>{form.location}</td></tr>
                    <tr><th>Cost:</th> <td>{form.cost}</td></tr>
                    <tr><th>Estimated Reimbursement:</th> <td>{form.estimatedReimbursement}</td></tr>
                    <tr><th>Type of Event:</th> <td>{form.typeOfEvent}</td></tr>
                    <tr><th>Grading Format:</th> <td>{form.gradingFormat}</td></tr>
                    <tr><th>Justification:</th> <td>{form.justificationForEvent}</td></tr>
                    <tr><th>Status:</th> <td>{form.status}</td></tr>
                    <tr><th>Amount to be Awarded:</th> <td>{form.toBeAwarded}</td></tr>
                    <tr><th>Reason for Modification:</th> <td>{form.jusitificationForModification}</td></tr>
                </table>
                {/* can see reject/accept/more info buttons if :
                            status is 'Needs DS approval' and user is DS or DH
                            status is 'Needs DH approval' and user is DH
                            status is 'Needs Benco approval' and user is Benco
                            */}
                {displayButtons()}

            </div>
        )

    } else {
        if (form.status != 'Accepted') {
            if (form.urgent == true) {
                return (
                    <div className='form'>
                        <table className='table table-warning table-primary table-sm table-bordered'>
                            <tr><th>Form ID:</th> <td>{form.id}</td></tr>
                            <tr><th>Name:</th> <td>{form.name}</td></tr>
                            <tr><th>Email:</th> <td>{form.username}@garlondIronworks.com</td></tr>
                            <tr><th>Start Date:</th> <td>{form.startDate}</td></tr>
                            <tr><th>Event Time:</th> <td>{form.time}</td></tr>
                            <tr><th>Location:</th> <td>{form.location}</td></tr>
                            <tr><th>Cost:</th> <td>{form.cost}</td></tr>
                            <tr><th>Estimated Reimbursement:</th> <td>{form.estimatedReimbursement}</td></tr>
                            <tr><th>Type of Event:</th> <td>{form.typeOfEvent}</td></tr>
                            <tr><th>Grading Format:</th> <td>{form.gradingFormat}</td></tr>
                            <tr><th>Justification:</th> <td>{form.justificationForEvent}</td></tr>
                            <tr><th>Status:</th> <td>{form.status}</td></tr>
                        </table>
                        {/* can see reject/accept/more info buttons if :
                            status is 'Needs DS approval' and user is DS or DH
                            status is 'Needs DH approval' and user is DH
                            status is 'Needs Benco approval' and user is Benco
                            */}
                        {displayButtons()}

                    </div>
                );
            } else {
                return (
                    <div className='form'>
                        <table className='table table-primary table-sm table-bordered'>
                            <tr><th>Form ID:</th> <td>{form.id}</td></tr>
                            <tr><th>Name:</th> <td>{form.name}</td></tr>
                            <tr><th>Email:</th> <td>{form.username}@garlondIronworks.com</td></tr>
                            <tr><th>Start Date:</th> <td>{form.startDate}</td></tr>
                            <tr><th>Event Time:</th> <td>{form.time}</td></tr>
                            <tr><th>Location:</th> <td>{form.location}</td></tr>
                            <tr><th>Cost:</th> <td>{form.cost}</td></tr>
                            <tr><th>Estimated Reimbursement:</th> <td>{form.estimatedReimbursement}</td></tr>
                            <tr><th>Type of Event:</th> <td>{form.typeOfEvent}</td></tr>
                            <tr><th>Grading Format:</th> <td>{form.gradingFormat}</td></tr>
                            <tr><th>Justification:</th> <td>{form.justificationForEvent}</td></tr>
                            <tr><th>Status:</th> <td>{form.status}</td></tr>
                        </table>
                        {/* can see reject/accept/more info buttons if :
                            status is 'Needs DS approval' and user is DS or DH
                            status is 'Needs DH approval' and user is DH
                            status is 'Needs Benco approval' and user is Benco
                            */}
                        {displayButtons()}

                    </div>
                );
            }

        } else {
            return (
                <div className='form'>
                    <table className='table table-primary table-sm table-bordered'>
                        <tr><th>Form ID:</th> <td>{form.id}</td></tr>
                        <tr><th>Name:</th> <td>{form.name}</td></tr>
                        <tr><th>Email:</th> <td>{form.username}@garlondIronworks.com</td></tr>
                        <tr><th>Start Date:</th> <td>{form.startDate}</td></tr>
                        <tr><th>Event Time:</th> <td>{form.time}</td></tr>
                        <tr><th>Location:</th> <td>{form.location}</td></tr>
                        <tr><th>Cost:</th> <td>{form.cost}</td></tr>
                        <tr><th>Estimated Reimbursement:</th> <td>{form.estimatedReimbursement}</td></tr>
                        <tr><th>Type of Event:</th> <td>{form.typeOfEvent}</td></tr>
                        <tr><th>Grading Format:</th> <td>{form.gradingFormat}</td></tr>
                        <tr><th>Justification:</th> <td>{form.justificationForEvent}</td></tr>
                        <tr><th>Status:</th> <td>{form.status}</td></tr>
                    </table>
                </div>
            );
        }
    }

}





