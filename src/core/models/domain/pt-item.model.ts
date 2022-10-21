import { PtObjectBase, PtObjectBaseServer, PtTask, PtComment, PtUser, PtUserServer, PtCommentServer, PtTaskServer, ptUserServerToPtUser, ptCommentsServerToPtComments, ptTasksServerToPtTasks } from './';
import { PriorityEnum, StatusEnum } from './enums';
import { PtItemType } from '../domain/types';

type PtItemCommon = {
    description?: string;
    priority: PriorityEnum;
    status: StatusEnum;
    estimate: number;
    type: PtItemType;
};

type PtItemWithAssignee = {
    assignee: PtUser;
};

type PtItemWithAssigneeServer = {
    assignee: PtUserServer;
};

type PtItemWithComments = {
    comments: PtComment[];
};

type PtItemWithCommentsServer = {
    comments: PtCommentServer[];
};

type PtItemWithTasks = {
    tasks: PtTask[];
};

type PtItemWithTasksServer = {
    tasks: PtTaskServer[];
};

export type PtItem = PtObjectBase & PtItemCommon & PtItemWithAssignee & PtItemWithComments & PtItemWithTasks;
export type PtItemServer = PtObjectBaseServer & PtItemCommon & PtItemWithAssigneeServer & PtItemWithCommentsServer & PtItemWithTasksServer;


export function ptItemServerToPtItem(item: PtItemServer): PtItem {
    return {
        ...item,
        dateCreated: new Date(item.dateCreated),
        dateModified: new Date(item.dateModified),
        dateDeleted: item.dateDeleted ? new Date(item.dateDeleted) : undefined,
        assignee: ptUserServerToPtUser(item.assignee),
        comments: item.comments ? ptCommentsServerToPtComments(item.comments) : [],
        tasks: item.tasks ? ptTasksServerToPtTasks(item.tasks) : []
    };
}

export function ptItemsServerToPtItems(items: PtItemServer[]): PtItem[] {
    return items.map(ptItemServerToPtItem);
}

// type tests
const b: PtItemServer = {
    id: 0,
    title: 'title',
    description: 'description',
    priority: PriorityEnum.Medium,
    status: StatusEnum.Open,
    estimate: 0,
    type: 'Bug',
    assignee: {
        id: 0,
        fullName: 'fullName',
        avatar: 'avatarUrl',
        dateCreated: 'dateCreated',
        dateModified: 'dateModified',
        dateDeleted: 'dateDeleted'
    },
    tasks: [
        {
            id: 0,
            title: 'title',
            completed: false,
            dateCreated: 'dateCreated',
            dateModified: 'dateModified',
            dateDeleted: 'dateDeleted'
        }
    ],
    comments: [
        {
            id: 0,
            title: 'title',
            user: {
                id: 0,
                fullName: 'fullName',
                avatar: 'avatarUrl',
                dateCreated: 'dateCreated',
                dateModified: 'dateModified',
                dateDeleted: 'dateDeleted'
            },
            dateCreated: 'dateCreated',
            dateModified: 'dateModified',
            dateDeleted: 'dateDeleted'
        }
    ],
    dateCreated: 'dateCreated',
    dateModified:   'dateModified',
    dateDeleted: 'dateDeleted',
};

const c: PtItem = {
    id: 0,
    title: 'title',
    description: 'description',
    priority: PriorityEnum.Medium,
    status: StatusEnum.Open,
    estimate: 0,
    type: 'Bug',
    assignee: {
        id: 0,
        fullName: 'fullName',
        avatar: 'avatarUrl',
        dateCreated: new Date(),
        dateModified: new Date(),
        dateDeleted: new Date(),
    },
    tasks: [
        {
            id: 0,
            title: 'title',
            completed: false,
            dateCreated: new Date(),
            dateModified: new Date(),
            dateDeleted: new Date(),
        }
    ],
    comments: [
        {
            id: 0,
            title: 'title',
            user: {
                id: 0,
                fullName: 'fullName',
                avatar: 'avatarUrl',
                dateCreated: new Date(),
                dateModified: new Date(),
                dateDeleted: new Date(),
            },
            dateCreated: new Date(),
            dateModified: new Date(),
            dateDeleted: new Date(),
        }
    ],
    dateCreated: new Date(),
    dateModified:  new Date(),
    dateDeleted: new Date(),
};