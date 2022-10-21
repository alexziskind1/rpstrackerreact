import { useState } from "react";
import { EMPTY_STRING } from "../../../../core/helpers";
import { PtUser } from "../../../../core/models/domain";

export type CommentFormProps = {
    addComment: (text: string) => void;
    currentUser: PtUser;
};

export function NewCommentForm(props: CommentFormProps) {

    const [newCommentText, setNewCommentText] = useState<string>(EMPTY_STRING);

    function onNewCommentChanged(e: any) {
        setNewCommentText(e.target.value);
    }

    function onAddTapped() {
        const newTitle = newCommentText.trim();
        if (newTitle.length === 0) {
            return;
        }
        props.addComment(newTitle);
        setNewCommentText(EMPTY_STRING);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onAddTapped();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row align-items-center">

                <img src={props.currentUser.avatar} className="mr-3 li-avatar rounded" />

                <div className="col-sm-6">
                    <textarea value={newCommentText} onChange={onNewCommentChanged} placeholder="Enter new comment..." className="form-control pt-text-comment-add"
                        name="newComment"></textarea>
                </div>
                <button type="button" onClick={onAddTapped} className="btn btn-primary" disabled={!newCommentText}>Add</button>
            </div>
        </form >
    );
}