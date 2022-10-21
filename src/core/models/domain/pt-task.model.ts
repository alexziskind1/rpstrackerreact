import { PtObjectBase, PtObjectBaseServer } from './';

type PtTaskCommon = {
    completed: boolean;
}

export type PtTask = PtObjectBase & PtTaskCommon & {
    dateStart?: Date;
    dateEnd?: Date;
}

export type PtTaskServer = PtObjectBaseServer & PtTaskCommon & {
    dateStart?: string;
    dateEnd?: string;
}

export type PtTaskToBe = Omit<PtTask, 'id'>;

export function ptTaskServerToPtTask(task: PtTaskServer): PtTask {
    return {
        ...task,
        dateCreated: new Date(task.dateCreated),
        dateModified: new Date(task.dateModified),
        dateDeleted: task.dateDeleted ? new Date(task.dateDeleted) : undefined,
        dateStart: task.dateStart ? new Date(task.dateStart) : undefined,
        dateEnd: task.dateEnd ? new Date(task.dateEnd) : undefined
    };
}

export function ptTasksServerToPtTasks(tasks: PtTaskServer[]): PtTask[] {
    return tasks.map(ptTaskServerToPtTask);
}
