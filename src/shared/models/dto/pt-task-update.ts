import { PtTask } from '../../../core/models/domain';

export type PtTaskTitleUpdate = {
    task: PtTask;
    newTitle: string;
}
