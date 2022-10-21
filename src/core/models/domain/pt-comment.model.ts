import { PtObjectBase, PtUser } from './';

export interface PtComment extends PtObjectBase {
    user?: PtUser;
}

export type PtCommentToBe = Omit<PtComment, 'id'>;