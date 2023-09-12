import { PtTask } from "../../../../core/models/domain";

export type PtTaskDisplayComponentProps = {
    task: PtTask;
    onToggleTaskCompletion: (task: PtTask) => void;
    onDeleteTask: (task: PtTask) => void;
    onTaskFocused: (task: PtTask) => void;
    onTaskBlurred: (task: PtTask) => void;
    taskTitleChange: (task: PtTask, newTitle: string) => void;
};

export function PtTaskDisplayComponent(props: PtTaskDisplayComponentProps) {

    const { task, onToggleTaskCompletion, onDeleteTask  } = props;

    function taskTitleChange(event: any) {
        if (task.title === event.target.value) {
            return;
        }
        props.taskTitleChange(task, event.target.value);
    }

    function toggleTapped() {
        onToggleTaskCompletion(task);
    }

    function deleteTapped() {
        onDeleteTask(task);
    }
    
    function onFocused() {
        props.onTaskFocused(task);
    }

    function onBlurred() {
        props.onTaskBlurred(task);
    }

    return (
        <div key={task.id} className="input-group mb-3 col-sm-12">
            <div className="input-group-prepend">
                <div className="input-group-text">
                    <input type="checkbox" checked={task.completed} onChange={toggleTapped} aria-label="Checkbox for following text input"
                        name={'checked' + task.id} />
                </div>
            </div>
            <input defaultValue={task.title} onChange={taskTitleChange} onFocus={onFocused} onBlur={onBlurred}
                type="text" className="form-control" aria-label="Text input with checkbox" name={'tasktitle' + task.id} />

            <div className="input-group-append">
                <button className="btn btn-danger" type="button" onClick={deleteTapped}>Delete</button>
            </div>
        </div>
    );
}