import { PtObjectBase } from './';

export interface PtTask extends PtObjectBase {
    completed: boolean;
    dateStart?: Date;
    dateEnd?: Date;
}

export type PtTaskToBe = Omit<PtTask, 'id'>;