import { PtObjectBase, PtObjectBaseServer, PtUser, PtUserServer, ptUserServerToPtUser } from './';

export type PtComment = PtObjectBase & {
    user?: PtUser;
}

export type PtCommentServer = PtObjectBaseServer & {
    user?: PtUserServer;
}

export type PtCommentToBe = Omit<PtComment, 'id'>;

export function ptCommentServerToPtComment(comment: PtCommentServer): PtComment {
    return {
        ...comment,
        dateCreated: new Date(comment.dateCreated),
        dateModified: new Date(comment.dateModified),
        dateDeleted: comment.dateDeleted ? new Date(comment.dateDeleted) : undefined,
        user: comment.user ? ptUserServerToPtUser(comment.user) : undefined
    };
}

export function ptCommentsServerToPtComments(comments: PtCommentServer[]): PtComment[] {
    return comments.map(ptCommentServerToPtComment);
}

