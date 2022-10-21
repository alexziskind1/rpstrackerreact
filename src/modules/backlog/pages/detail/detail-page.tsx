import { useState } from "react";

import { PtItem, PtUser, PtTask } from "../../../../core/models/domain";
import { DetailScreenType } from "../../../../shared/models/ui/types/detail-screens";
import { Store } from "../../../../core/state/app-store";
import { BacklogRepository } from "../../repositories/backlog.repository";
import { BacklogService } from "../../services/backlog.service";
import { PtItemDetailsComponent } from "../../components/item-details/pt-item-details";
import { PtItemTasksComponent } from "../../components/item-tasks/pt-item-tasks";

import { PtUserService } from "../../../../core/services/pt-user-service";
import { Observable } from "rxjs";
import { PtNewTask } from "../../../../shared/models/dto/pt-new-task";
import { PtTaskTitleUpdate } from "../../../../shared/models/dto/pt-task-update";
import { PtItemChitchatComponent } from "../../components/item-chitchat/pt-item-chitchat";
import { PtNewComment } from "../../../../shared/models/dto/pt-new-comment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";


const store: Store = new Store();
const backlogRepo: BacklogRepository = new BacklogRepository();
const backlogService: BacklogService = new BacklogService(backlogRepo, store);
const ptUserService: PtUserService = new PtUserService(store);

type GetPtItemParams = Parameters<typeof backlogService.getPtItem>;
const queryTag = 'item';

export function DetailPage() {

    const currentUser = store.value.currentUser;
    const users$: Observable<PtUser[]> = store.select<PtUser[]>('users');

    const { id: itemId, screen } = useParams() as { id: string, screen: DetailScreenType };

    const queryClient = useQueryClient();
    const history = useHistory();

    const useItem = (...params: GetPtItemParams) => {
        return useQuery<PtItem, Error>(queryTag, () => backlogService.getPtItem(...params));
    }
    const queryResult = useItem(parseInt(itemId));
    const item = queryResult.data;

    const [selectedDetailsScreen, setSelectedDetailsScreen] = useState<DetailScreenType>(screen ? screen : 'details');

    const updateItemMutation = useMutation(async (itemToUpdate: PtItem) => {
        const updatedItem = await backlogService.updatePtItem(itemToUpdate);
        return updatedItem;
    });
    
    const addTaskMutation = useMutation(async (newTaskItem: PtNewTask) => {
        const createdTask = await backlogService.addNewPtTask(newTaskItem, item!);
        return createdTask;
    });

    const toggleTaskCompletionMutation = useMutation(async (task: PtTask) => {
        const updatedTask = await backlogService.updatePtTask(item!, task, true);
        return updatedTask;
    });

    const updateTaskMutation = useMutation(async (taskUpdate: PtTaskTitleUpdate) => {
        const updatedTask = await backlogService.updatePtTask(item!, taskUpdate.task, taskUpdate.task.completed, taskUpdate.newTitle);
        return updatedTask;
    });

    const deleteTaskMutation = useMutation(async (task: PtTask ) => {
        const ok = await backlogService.deletePtTask(item!, task);
        return ok;
    });

    const addCommentMutation = useMutation(async (newCommentItem: PtNewComment) => {
        const createdComment = await backlogService.addNewPtComment(newCommentItem, item!);
        return createdComment;
    });

    function onScreenSelected(screen: DetailScreenType) {
        setSelectedDetailsScreen(screen);
        history.push(`/detail/${itemId}/${screen}`);
    }

    function onItemSaved(item: PtItem) {
        updateItemMutation.mutate(item, {
            onSuccess: (updatedItem) => {
                queryClient.setQueryData(queryTag, updatedItem);
            }
        });
    }

    function onUsersRequested() {
        ptUserService.fetchUsers();
    }

    function screenRender(screen: DetailScreenType, item: PtItem) {
        switch (screen) {
            case 'details':
                return <PtItemDetailsComponent 
                    item={item} 
                    users$={users$} 
                    usersRequested={onUsersRequested} 
                    itemSaved={onItemSaved} />;
            case 'tasks':
                return <PtItemTasksComponent 
                    tasks={item.tasks} 
                    addTaskMutation={addTaskMutation} 
                    deleteTaskMutation={deleteTaskMutation}
                    toggleTaskCompletionMutation={toggleTaskCompletionMutation}
                    updateTaskMutation={updateTaskMutation}
                    />;
            case 'chitchat':
                return <PtItemChitchatComponent 
                    comments={item.comments} 
                    currentUser={currentUser!} 
                    addCommentMutation={addCommentMutation} 
                />;

            default:
                return <PtItemDetailsComponent item={item} users$={users$} usersRequested={() => onUsersRequested()} itemSaved={(item) => onItemSaved(item)} />;
        }
    }

    if (queryResult.isLoading) {
        return <div>Loading...</div>
    }

    if (!item) {
        return <div>No item</div>
    }
    
    return (

        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                <h1 className="h2">{item.title}</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group mr-2">
                        <button type="button" onClick={(e) => onScreenSelected('details')} className={'btn btn-sm btn-outline-secondary ' + selectedDetailsScreen === 'details' ? 'active' : ''}>Details</button>

                        <button type="button" onClick={(e) => onScreenSelected('tasks')} className={"btn btn-sm btn-outline-secondary " + selectedDetailsScreen === 'tasks' ? 'active' : ''}>Tasks</button>

                        <button type="button" onClick={(e) => onScreenSelected('chitchat')} className={"btn btn-sm btn-outline-secondary " + selectedDetailsScreen === 'chitchat' ? 'active' : ''}>Chitchat</button>
                    </div>
                </div>
            </div>

            {screenRender(selectedDetailsScreen, item)}

        </div>
    );
   
}
