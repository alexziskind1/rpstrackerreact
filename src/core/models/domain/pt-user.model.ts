import { PtObjectBase, PtObjectBaseServer } from './';

type PtUserCommon = {
    fullName: string;
    avatar: string;
};

export type PtUser = PtObjectBase & PtUserCommon;

export type PtUserServer = PtObjectBaseServer & PtUserCommon;

export function ptUserServerToPtUser(user: PtUserServer): PtUser {
    return {
        ...user,
        dateCreated: new Date(user.dateCreated),
        dateModified: new Date(user.dateModified),
        dateDeleted: user.dateDeleted ? new Date(user.dateDeleted) : undefined
    };
}

export function ptUsersServerToPtUsers(users: PtUserServer[]): PtUser[] {
    return users.map(ptUserServerToPtUser);
}