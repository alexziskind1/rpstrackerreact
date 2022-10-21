import { PtTask } from "../../../../core/models/domain";

export type PtTaskDisplayComponentProps = {
    task: PtTask;
    onToggleTaskCompletion: (task: PtTask) => void;
    onDeleteTask: (task: PtTask) => void;
    //completeTaskMutation: MutationFunction<PtTask, PtTask>;
    //deleteTaskMutation: MutationFunction<boolean, PtTask>;
};

export function PtTaskDisplayComponent(props: PtTaskDisplayComponentProps) {

    const { task, onToggleTaskCompletion, onDeleteTask  } = props;

    function taskTitleChange(event: any) {
        if (task.title === event.target.value) {
            return;
        }
    }

    function toggleTapped() {
        onToggleTaskCompletion(task);
    }

    function deleteTapped() {
        onDeleteTask(task);
    }
    

    function onTaskFocused() {
    }

    function onTaskBlurred() {
    }

    return (
        <div key={task.id} className="input-group mb-3 col-sm-6">
            <div className="input-group-prepend">
                <div className="input-group-text">
                    <input type="checkbox" checked={task.completed} onChange={toggleTapped} aria-label="Checkbox for following text input"
                        name={'checked' + task.id} />
                </div>
            </div>
            <input defaultValue={task.title} onChange={taskTitleChange} onFocus={onTaskFocused} onBlur={onTaskBlurred}
                type="text" className="form-control" aria-label="Text input with checkbox" name={'tasktitle' + task.id} />

            <div className="input-group-append">
                <button className="btn btn-danger" type="button" onClick={deleteTapped}>Delete</button>
            </div>
        </div>
    );
}