import React, { useEffect, useState } from "react";
import { PtComment, PtUser } from "../../../../core/models/domain";
import { EMPTY_STRING } from "../../../../core/helpers";
import { BehaviorSubject } from "rxjs";
import { PtNewComment } from "../../../../shared/models/dto/pt-new-comment";

import './pt-item-chitchat.css';

interface PtItemChitchatComponentProps {
    //comments$: BehaviorSubject<PtComment[]>;
    comments: PtComment[];
    currentUser: PtUser;
    addNewComment: (newComment: PtNewComment) => void;
}

export function PtItemChitchatComponent(props: PtItemChitchatComponentProps) {

    const [newCommentText, setNewCommentText] = useState(EMPTY_STRING);
    const [comments, setComments] = useState<PtComment[]>(props.comments);
    useEffect(()=>{
        debugger;
    }, [comments]);

    //function componentDidMount() {
    //props.comments$.subscribe((comments: PtComment[]) => {
    //    setComments(comments);
    //});
    //}

    function onNewCommentChanged(e: any) {
        setNewCommentText(e.target.value);
    }

    function onAddTapped() {
        debugger;
        const newTitle = newCommentText.trim();
        if (newTitle.length === 0) {
            return;
        }
        const newComment: PtNewComment = {
            title: newTitle
        };
        props.addNewComment(newComment);

        setNewCommentText(EMPTY_STRING);
    }

    return (
        <React.Fragment>
            <form>
                <div className="form-row align-items-center">

                    <img src={props.currentUser.avatar} className="mr-3 li-avatar rounded" />

                    <div className="col-sm-6">
                        <textarea defaultValue={newCommentText} onChange={(e) => onNewCommentChanged(e)} placeholder="Enter new comment..." className="form-control pt-text-comment-add"
                            name="newComment"></textarea>
                    </div>
                    <button type="button" onClick={() => onAddTapped()} className="btn btn-primary" disabled={!newCommentText}>Add</button>
                </div>
            </form >

            <hr />

            <ul className="list-unstyled">
                {
                    comments.map(comment => {
                        return (
                            <li key={comment.id} className="media chitchat-item">
                                <img src={comment.user!.avatar} className="mr-3 li-avatar rounded" />
                                <div className="media-body">
                                    <h6 className="mt-0 mb-1"><span>{comment.user!.fullName}</span><span className="li-date">{comment.dateCreated.toString()}</span></h6>

                                    <span className="chitchat-text ">{comment.title}</span>

                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </React.Fragment >
    );
   
}
