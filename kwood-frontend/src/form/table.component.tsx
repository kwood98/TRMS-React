
import { Component, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAllForms, getUser, getUserForms, getViewableForms } from '../actions';
import { formState, UserState } from '../reducer';
import userService from '../user/user.service';
import { Form } from './form';
import FormComponent from './form.component';
import formService from './form.service';


export default function TableComponent() {
    const selectUserForms = (state: formState) => state.userForms;
    const forms = useSelector(selectUserForms);

    const selectAllForms = (state: formState) => state.allForms;
    const allForms = useSelector(selectAllForms);

    const selectViewableForms = (state: formState) => state.viewableForms;
    const viewableForms = useSelector(selectViewableForms);

    const dispatch = useDispatch();

    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);

    const supSelector = (state: UserState) => state.supervisor;
    const sup = useSelector(supSelector);
    const history = useHistory();

    const involvedForms: Form[] = [];

    let change = false;



    useEffect(() => {
        //get all forms user is involved in
        console.log('in use effect, table component')
        formService.getAllForms().then((allForms) => {
            dispatch(getAllForms(allForms));
            console.log(allForms)
            allForms.forEach(async (item) => {
                if (item.involvedUsers.includes(user.username) && item.rejected == false) {
                    involvedForms.push(item);
                }
                if (item.rejected == false) {
                    if (await getViewForms(item)) {
                        viewableForms.push(item);
                    }

                }
            })
            dispatch(getViewableForms(viewableForms))
        })

        forms.sort(function (a, b) {
            return b.id - a.id;
        });

        
    }, [history])





async function getViewForms(item: Form): Promise<Boolean> {
    let isViewable = false;
    if (item.rejected == false) {
        console.log('is true')
        console.log(user)

        //if user is already involved in form
        await userService.getUserByName(item.username).then(async (formUser) => {
            await userService.getUserByName(user.username).then((user) => {
                console.log(user.position.includes('BenCo'))
                console.log(item.status)
                console.log(item)
                if (item.involvedUsers.includes(user.username) && item.username != user.username) {
                    console.log('involved user')
                    isViewable = true;

                    //if form needs DH approval and user is a Dh
                } else if (user.position.includes('Department Head') && item.status == 'Needs DH approval' && item.username != user.username) {
                    console.log('is dh')
                    isViewable = true;
                    //if form needs DS approval and user is DS    

                } else if (user.position.includes('Department Head') && item.status == 'Needs DS approval' && item.username != user.username) {
                    console.log('is dh')
                    isViewable = true;
                } else if (formUser.superior == user.username) {
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
allForms.forEach((item) => {
    if (item.involvedUsers.includes(user.username) && item.rejected == false) {
        involvedForms.push(item);
    }
})

forms.sort(function (a, b) {
    return b.id - a.id;
});

change = true;

return (
    <div>

        <section className='formsContainer'>
            <h4>Available Tuition Reimbursement: {1000 - user.pendingReimbursements - user.awardedReimbursements}</h4>
            <br />
            <h2>Submitted Forms</h2>
            <table className="table table-primary table-sm table-bordered">
                <tr>
                    <th>Form ID</th>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>Type of Event</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Link to full form</th>
                </tr>
                {forms.map((value, index: number) => {
                    return (
                        <FormComponent
                            key={'forms-' + index}
                            data={value}
                        ></FormComponent>
                    );
                })}
            </table>
        </section>
        {user.position.length != 1 && (
            <section className='formsContainer'>
                <h2>Involved Forms</h2>
                <table className="table table-primary table-sm table-bordered">
                    <tr>
                        <th>Form ID</th>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>Type of Event</th>
                        <th>Cost</th>
                        <th>Status</th>
                        <th>Link to full form</th>
                    </tr>
                    {involvedForms.map((value, index: number) => {
                        return (
                            <FormComponent
                                key={'forms-' + index}
                                data={value}
                            ></FormComponent>
                        );
                    })}
                </table>
            </section>
        )}

        {user.position.length != 1 && (
            <section className='formsContainer'>
                <h2>All Forms</h2>
                <table className="table table-primary table-sm table-bordered">
                    <tr>
                        <th>Form ID</th>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>Type of Event</th>
                        <th>Cost</th>
                        <th>Status</th>
                        <th>Link to full form</th>
                    </tr>

                    {viewableForms.map((value, index: number) => {
                        return (
                            <FormComponent
                                key={'forms-' + index}
                                data={value}
                            ></FormComponent>

                        );
                    })}
                </table>
            </section>
        )}


    </div>
)
}