import { PtTask, PtItem, PtComment } from '../../../core/models/domain';
import { CONFIG } from '../../../config';
import { PresetType } from '../../../core/models/domain/types';


export class BacklogRepository {

    private getFilteredBacklogUrl(currentPreset: PresetType, currentUserId?: number) {
        switch (currentPreset) {
            case 'my':
                if (currentUserId) {
                    return `${CONFIG.apiEndpoint}/myItems?userId=${currentUserId}`;
                } else {
                    return `${CONFIG.apiEndpoint}/backlog`;
                }
            case 'open':
                return `${CONFIG.apiEndpoint}/openItems`;
            case 'closed':
                return `${CONFIG.apiEndpoint}/closedItems`;
            default:
                return `${CONFIG.apiEndpoint}/backlog`;
        }
    }

    private getPtItemUrl(itemId: number) {
        return `${CONFIG.apiEndpoint}/item/${itemId}`;
    }

    private postPtItemUrl() {
        return `${CONFIG.apiEndpoint}/item`;
    }

    private putPtItemUrl(itemId: number) {
        return `${CONFIG.apiEndpoint}/item/${itemId}`;
    }

    private deletePtItemUrl(itemId: number) {
        return `${CONFIG.apiEndpoint}/item/${itemId}`;
    }

    private postPtTaskUrl() {
        return `${CONFIG.apiEndpoint}/task`;
    }

    private putPtTaskUrl(taskId: number) {
        return `${CONFIG.apiEndpoint}/task/${taskId}`;
    }

    private deletePtTaskUrl(itemId: number, taskId: number) {
        return `${CONFIG.apiEndpoint}/task/${itemId}/${taskId}`;
    }

    private postPtCommentUrl() {
        return `${CONFIG.apiEndpoint}/comment`;
    }

    private deletePtCommentUrl(commentId: number) {
        return `${CONFIG.apiEndpoint}/comment/${commentId}`;
    }

    public getPtItems(
        currentPreset: PresetType,
        currentUserId: number | undefined
    ): Promise<PtItem[]> {
        return fetch(this.getFilteredBacklogUrl(currentPreset, currentUserId))
            .then((response: Response) => response.json());
    }

    /*
    public getPtItem(
        ptItemId: number,
    ): Promise<PtItem> {
        return fetch(this.getPtItemUrl(ptItemId))
            .then((response: Response) => response.json());
    }

    public insertPtItem(
        item: PtItem,
        successHandler: (nextItem: PtItem) => void
    ) {
        this.http.post<PtItem>(
            this.postPtItemUrl(),
            { item: item }
        )
            .subscribe(successHandler);
    }

    public updatePtItem(
        item: PtItem,
    ): Promise<PtItem> {
        return this.http.put<PtItem>(
            this.putPtItemUrl(item.id),
            { item: item }
        );
    }

    public deletePtItem(
        itemId: number,
        successHandler: () => void
    ) {
        this.http.delete(
            this.deletePtItemUrl(itemId)
        )
            .subscribe(successHandler);
    }

    public insertPtTask(
        task: PtTask,
        ptItemId: number,
        successHandler: (nextTask: PtTask) => void
    ) {
        this.http.post<PtTask>(
            this.postPtTaskUrl(),
            { task: task, itemId: ptItemId }
        )
            .subscribe(successHandler);
    }

    public updatePtTask(
        task: PtTask,
        ptItemId: number,
        successHandler: (updatedTask: PtTask) => void
    ) {
        this.http.put<PtTask>(
            this.putPtTaskUrl(task.id),
            { task: task, itemId: ptItemId }
        )
            .subscribe(successHandler);
    }

    public deletePtTask(
        task: PtTask,
        ptItemId: number,
        successHandler: (ok: boolean) => void
    ) {
        this.http.post<boolean>(
            this.deletePtTaskUrl(ptItemId, task.id),
            {}
        )
            .subscribe(successHandler);
    }

    public insertPtComment(
        comment: PtComment,
        ptItemId: number,
        successHandler: (nextComment: PtComment) => void
    ) {
        this.http.post<PtComment>(
            this.postPtCommentUrl(),
            { comment: comment, itemId: ptItemId }
        )
            .subscribe(successHandler);
    }

    public deletePtComment(
        ptCommentId: number,
        successHandler: () => void
    ) {
        this.http.delete(this.deletePtCommentUrl(ptCommentId))
            .subscribe(successHandler);
    }
    */
}
