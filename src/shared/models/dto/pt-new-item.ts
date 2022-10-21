import { PtItemType } from '../../../core/models/domain/types';

export type PtNewItem = {
    title: string;
    description?: string;
    typeStr: PtItemType;
}
