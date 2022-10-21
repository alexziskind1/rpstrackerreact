import { useState } from "react";
import { EMPTY_STRING } from "../../../../core/helpers";

export type TaskFormProps = {
    addTask: (text: string) => void;
};

export function NewTaskForm(props: TaskFormProps) {

    const [newTaskTitle, setNewTaskTitle] = useState<string>(EMPTY_STRING);

    function onNewTaskTitleChanged(e: any) {
        setNewTaskTitle(e.target.value);
    }

    function onAddTapped() {
        const newTitle = newTaskTitle.trim();
        if (newTitle.length === 0) {
            return;
        }
        props.addTask(newTitle);
        setNewTaskTitle(EMPTY_STRING);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onAddTapped();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row align-items-center">
                <div className="col-sm-6">
                    <input value={newTaskTitle} onChange={onNewTaskTitleChanged} placeholder="Enter new task..." className="form-control pt-text-task-add"
                        name="newTask" />
                </div>
                <button type="button" onClick={() => onAddTapped()} className="btn btn-primary" disabled={!newTaskTitle}>Add</button>
            </div>
        </form>
    );
}