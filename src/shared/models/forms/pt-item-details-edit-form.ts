import { PtItem } from '../../../core/models/domain';

export type PtItemDetailsEditFormModel = {
    title: string;
    description: string;
    typeStr: string;
    statusStr: string;
    estimate: number;
    priorityStr: string;
    assigneeName: string;
}

export function ptItemToFormModel(item: PtItem): PtItemDetailsEditFormModel {
    return {
        title: item.title ? item.title : '',
        description: item.description ? item.description : '',
        typeStr: item.type,
        statusStr: item.status,
        estimate: item.estimate,
        priorityStr: item.priority,
        assigneeName: item.assignee ? item.assignee.fullName : 'unassigned'
    };
}
