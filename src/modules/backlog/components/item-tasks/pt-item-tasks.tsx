import { useState } from "react";
import { PtTask } from "../../../../core/models/domain";
import { EMPTY_STRING } from "../../../../core/helpers";
import { PtTaskUpdate } from "../../../../shared/models/dto/pt-task-update";
import { PtNewTask } from "../../../../shared/models/dto/pt-new-task";
import { PtTaskDisplayComponent } from "./pt-task-display";
import { UseMutationResult } from "react-query";
import { NewTaskForm } from "./new-task-form";

export type PtItemTasksComponentProps = {
    tasks: PtTask[];
    addTaskMutation: UseMutationResult<PtTask, unknown, PtNewTask, unknown>;
    deleteTaskMutation: UseMutationResult<boolean, unknown, PtTask, unknown>;
    toggleTaskCompletionMutation: UseMutationResult<PtTask, unknown, PtTask, unknown>;
    updateTaskMutation: UseMutationResult<PtTask, unknown, PtTaskUpdate, unknown>;
    
    //addNewTask: (newTask: PtNewTask) => void;
    //updateTask: (taskUpdate: PtTaskUpdate) => void;
};

export function PtItemTasksComponent(props: PtItemTasksComponentProps) {

    const [tasks, setTasks] = useState<PtTask[]>(props.tasks);
    const [lastUpdatedTitle, setLastUpdatedTitle] = useState<string>(EMPTY_STRING);

    const addTask = (text: string) => {
        const newTask: PtNewTask = { title: text, completed: false };
        props.addTaskMutation.mutate(newTask, {
            onSuccess(createdTask) {
                const newTasks = [createdTask, ...tasks];
                setTasks(newTasks);
            },
        });
    };

    const toggleTaskCompletion = (index: number) => {
        const theTask = tasks[index];
        props.toggleTaskCompletionMutation.mutate(theTask, {
            onSuccess(toggledTask) {
                const newTasks = [...tasks];
                newTasks[index].completed = toggledTask.completed;
                setTasks(newTasks);
            },
        });
    };


    function toggleTapped(task: PtTask) {
        const index = tasks.findIndex(t => t.id === task.id);
        toggleTaskCompletion(index);
    }


    function taskTitleChange(task: PtTask, newTitle: string) {
        if (task.title === newTitle) {
            return;
        }
        
        setLastUpdatedTitle(newTitle);
    }

    function onTaskFocused(task: PtTask) {
        setLastUpdatedTitle(task.title ? task.title : EMPTY_STRING);
    }

    function updateTask(task: PtTask) {
        const index = tasks.findIndex(t => t.id === task.id);
        const taskUpdate: PtTaskUpdate = {
            task: task,
            newTitle: lastUpdatedTitle,
            toggle: false,
        };
        
        props.updateTaskMutation.mutate(taskUpdate, {
            onSuccess(updatedTask) {
                const newTasks = [...tasks];
                newTasks[index].title = updatedTask.title;
                setTasks(newTasks);
            },
        });
    }

    function onTaskBlurred(task: PtTask) {
        if (task.title === lastUpdatedTitle) {
            return;
        }
        updateTask(task);
        /*
        const taskUpdate: PtTaskUpdate = {
            task: task,
            toggle: false,
            newTitle: lastUpdatedTitle
        };
        */

        setLastUpdatedTitle(EMPTY_STRING);
       // props.updateTask(taskUpdate);
    }

    const removeTask = (index: number) => {
        const theTask = tasks[index];
        props.deleteTaskMutation.mutate(theTask!, {
            onSuccess(deleted) {
                if (deleted) {
                    const newChatEntries = [...tasks];
                    newChatEntries.splice(index, 1);
                    setTasks(newChatEntries);
                }
            },
        });
    };

    function deleteTapped(task: PtTask) {
        const index = tasks.findIndex(t => t.id === task.id);
        removeTask(index);
    }

    return (
        <div>

            <NewTaskForm addTask={addTask} />

            <hr />

            {
                tasks.map(task => {
                    return (
                        <PtTaskDisplayComponent 
                            key={task.id}
                            task={task} 
                            onToggleTaskCompletion={toggleTapped} 
                            onDeleteTask={deleteTapped}
                            onTaskFocused={onTaskFocused}
                            onTaskBlurred={onTaskBlurred}
                            taskTitleChange={taskTitleChange}
                            />
                    );
                })
            }

           
        </div>
    );
    
}
