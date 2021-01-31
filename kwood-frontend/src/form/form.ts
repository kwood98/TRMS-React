
export class Form {
    id = 0;
    name = '';
    username= '';
    startDate = '';
    submitDate= '';
    time='';
    location ='';
    description ='';
    cost = 0;
    gradingFormat = '';
    typeOfEvent = '';
    justificationForEvent = '';
    rejected = false;
    status = '';
    estimatedReimbursement = 0;
    involvedUsers: string[] = [];
    DS = '';
    modified = false;
    urgent = false;
    toBeAwarded?:number;
    awardedReimbursement?:number;
    jusitificationForModification?:string;
    grade?:string;
    justificationForRejection?: string;
    attachmentsEvent?: string;
    attachmentsApproval?: string;
    timeMissed?: string;
}