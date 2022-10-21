import { PtTask } from '../../../core/models/domain';

export interface PtTaskTitleUpdate {
    task: PtTask;
    newTitle: string;
}
