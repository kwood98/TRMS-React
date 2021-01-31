import logger from '../log';

export interface Form {
    id: number;
    name: string;
    username: string;
    startDate: string;
    submitDate:string;
    time: string;
    location: string;
    description: string;
    cost: number;
    estimatedReimbursement?:number;
    gradingFormat: string;
    typeOfEvent: string;
    justificationForEvent: string;
    rejected: Boolean;
    status: string;
    involvedUsers: string[];
    modified: Boolean;
    toBeAwarded?:number;
    awardedReimbursement?:number;
    urgent?:Boolean;
    jusitificationForModification?:string;
    DS?:string;
    justificationForRejection?:string;
    attachmentsEvent?: string;
    attachmentsApproval?: string;
    timeMissed?: string;
}