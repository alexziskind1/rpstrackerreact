import React, { useEffect, useState } from "react";

import { PtItem, PtUser, PtTask, PtComment } from "../../../../core/models/domain";
import { DetailScreenType } from "../../../../shared/models/ui/types/detail-screens";
import { Store } from "../../../../core/state/app-store";
import { BacklogRepository } from "../../repositories/backlog.repository";
import { BacklogService } from "../../services/backlog.service";
import { PtItemDetailsComponent } from "../../components/item-details/pt-item-details";
import { PtItemTasksComponent } from "../../components/item-tasks/pt-item-tasks";
// import { debug } from "util";
import { PtUserService } from "../../../../core/services/pt-user-service";
import { Observable, BehaviorSubject } from "rxjs";
import { PtNewTask } from "../../../../shared/models/dto/pt-new-task";
import { PtTaskUpdate } from "../../../../shared/models/dto/pt-task-update";
import { PtItemChitchatComponent } from "../../components/item-chitchat/pt-item-chitchat";
import { PtNewComment } from "../../../../shared/models/dto/pt-new-comment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";

interface DetailPageState {
    item: PtItem | undefined;
    selectedDetailsScreen: DetailScreenType;
}

const screenPositionMap: { [key in DetailScreenType | number]: number | DetailScreenType } = {
    0: 'details',
    1: 'tasks',
    2: 'chitchat',
    'details': 0,
    'tasks': 1,
    'chitchat': 2
};

const store: Store = new Store();
const backlogRepo: BacklogRepository = new BacklogRepository();
const backlogService: BacklogService = new BacklogService(backlogRepo, store);
const ptUserService: PtUserService = new PtUserService(store);

type GetPtItemParams = Parameters<typeof backlogService.getPtItem>;
const queryTag = 'item';

export function DetailPage(props: any) {


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
    const [tasks, setTasks] = useState<PtTask[]>(item ? item.tasks : []);
    const [comments, setComments] = useState<PtComment[]>(item ? item.comments : []);


    const updateItemMutation = useMutation(async (itemToUpdate: PtItem) => {
        const updatedItem = await backlogService.updatePtItem(itemToUpdate);
        return updatedItem;
    });
    
    useEffect(() => {
        //debugger;
        //history.push(`/detail/${itemId}/${screen}`);
    }, [selectedDetailsScreen]);

    const addTaskMutation = useMutation(async (newTaskItem: PtNewTask) => {
        const createdTask = await backlogService.addNewPtTask(newTaskItem, item!);
        return createdTask;
    });

    const toggleTaskCompletionMutation = useMutation(async (task: PtTask) => {
        const updatedTask = await backlogService.updatePtTask(item!, task, true);
        return updatedTask;
    });

    const deleteTaskMutation = useMutation(async (task: PtTask ) => {
        const ok = await backlogService.deletePtTask(item!, task);
        return ok;
    });

    /*
    useEffect(()=>{
        debugger;
        refresh();
    }, [item]);
    */

    /*
    constructor(props: any) {
        super(props);

        const { id, screen } = props.match.params;
        itemId = id;
        currentUser = store.value.currentUser;

        state = {
            item: undefined,
            selectedDetailsScreen: screen ? screen : 'details'
        };
    }
    */

    function componentDidMount() {
        //refresh();
    }

    /*
    function refresh() {
        backlogService.getPtItem(itemId)
            .then(item => {
                setItem(item);
                setTasks(item.tasks);
                setComments(item.comments);
                //setState({
                //    item: item
                //});
                //tasks$.next(item.tasks);
                //comments$.next(item.comments);
            });
    }
    */

    function onScreenSelected(screen: DetailScreenType) {
        /*setState({
            selectedDetailsScreen: screen
        });*/
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

    function onAddNewTask(newTask: PtNewTask) {
        if (item) {
            backlogService.addNewPtTask(newTask, item).then(nextTask => {
                //tasks$.next([nextTask].concat(tasks$.value));
                setTasks([nextTask].concat(tasks))
            });
        }
    }

    function onUpdateTask(taskUpdate: PtTaskUpdate) {
        if (item) {
            if (taskUpdate.delete) {
                backlogService.deletePtTask(item, taskUpdate.task).then(ok => {
                    if (ok) {
                        const newTasks = tasks.filter(task => {
                            if (task.id !== taskUpdate.task.id) {
                                return task;
                            }
                        });
                        //tasks$.next(newTasks);
                        setTasks(newTasks);
                    }
                });
            } else {
                backlogService.updatePtTask(item, taskUpdate.task, taskUpdate.toggle, taskUpdate.newTitle).then(updatedTask => {
                    const newTasks = tasks.map(task => {
                        if (task.id === updatedTask.id) {
                            return updatedTask;
                        } else {
                            return task;
                        }
                    });
                    //tasks$.next(newTasks);
                    setTasks(newTasks);
                });
            }
        }
    }





    function onAddNewComment(newComment: PtNewComment) {
        if (item) {
            backlogService.addNewPtComment(newComment, item).then(nextComment => {
                //comments$.next([nextComment].concat(comments$.value));
                setComments([nextComment].concat(comments));
            });
        }
    }

    function onUsersRequested() {
        ptUserService.fetchUsers();
    }

    function screenRender(screen: DetailScreenType, item: PtItem) {
        switch (screen) {
            case 'details':
                return <PtItemDetailsComponent item={item} users$={users$} usersRequested={() => onUsersRequested()} itemSaved={(item) => onItemSaved(item)} />;
            case 'tasks':
                return <PtItemTasksComponent 
                    tasks={item.tasks} 
                    addTaskMutation={addTaskMutation} 
                    deleteTaskMutation={deleteTaskMutation}
                    toggleTaskCompletionMutation={toggleTaskCompletionMutation}
                    addNewTask={(newTask) => onAddNewTask(newTask)} 
                    updateTask={(taskUpdate) => onUpdateTask(taskUpdate)} />;
            case 'chitchat':
                return <PtItemChitchatComponent comments={comments} currentUser={currentUser!} addNewComment={(newComment) => onAddNewComment(newComment)} />;

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
