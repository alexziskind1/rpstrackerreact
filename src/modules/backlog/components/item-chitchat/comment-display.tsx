import { PtComment } from "../../../../core/models/domain";

export type PtCommentDisplayComponentProps = {
    comment: PtComment;
};

export function PtCommentDisplayComponent(props: PtCommentDisplayComponentProps) {

    const { comment } = props;
    const dateStr = comment.dateCreated.toDateString();

    return (
        <li key={comment.id} className="media chitchat-item">
            <img src={comment.user!.avatar} className="mr-3 li-avatar rounded" />
            <div className="media-body">
                <h6 className="mt-0 mb-1"><span>{comment.user!.fullName}</span><span className="li-date">{dateStr}</span></h6>
                <span className="chitchat-text ">{comment.title}</span>
            </div>
        </li>
    );
}