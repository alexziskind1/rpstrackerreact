import { useState } from "react";
import { PtComment, PtUser } from "../../../../core/models/domain";
import { PtNewComment } from "../../../../shared/models/dto/pt-new-comment";

import './pt-item-chitchat.css';
import { NewCommentForm } from "./new-comment-form";
import { UseMutationResult } from "react-query";
import { PtCommentDisplayComponent } from "./comment-display";

export type PtItemChitchatComponentProps = {
    comments: PtComment[];
    currentUser: PtUser;
    addCommentMutation: UseMutationResult<PtComment, unknown, PtNewComment, unknown>;
};

export function PtItemChitchatComponent(props: PtItemChitchatComponentProps) {

    const [comments, setComments] = useState<PtComment[]>(props.comments);

    const addComment = (text: string) => {
        const newComment: PtNewComment = { title: text };
        props.addCommentMutation.mutate(newComment, {
            onSuccess(createdTask) {
                const newComments = [createdTask, ...comments];
                setComments(newComments);
            },
        });
    };


    return (
        <>
            <NewCommentForm 
                addComment={addComment}  
                currentUser={props.currentUser} 
            />

            <hr />

            <ul className="list-unstyled">
                {
                    comments.map(comment => {
                        return (
                            <PtCommentDisplayComponent key={comment.id} comment={comment} />
                        );
                    })
                }
            </ul>
        </>
    );
   
}
