import { PtTask, PtItem, PtComment, PtCommentToBe, PtTaskToBe, PtItemServer, PtTaskServer, PtCommentServer } from '../../../core/models/domain';
import { CONFIG } from '../../../config';
import { PresetType } from '../../../core/models/domain/types';
import urlcat from 'urlcat';

export class BacklogRepository {

    private getFilteredBacklogUrl(currentPreset: PresetType, searchTerm: string, currentUserId?: number) {

        let url = `${CONFIG.apiEndpoint}/backlog`;

        if (currentPreset == 'my') {
            url = urlcat(CONFIG.apiEndpoint, '/myItems', { userId: currentUserId, search: searchTerm });
        } else {
            url = urlcat(CONFIG.apiEndpoint, `/backlog`, { preset: currentPreset, search: searchTerm });
        }
        return url;

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
        searchTerm: string,
        currentUserId: number | undefined
    ): Promise<PtItemServer[]> {

        let url = this.getFilteredBacklogUrl(currentPreset, searchTerm, currentUserId);
        console.log(url);

        /*
        if (searchTerm && searchTerm.length >= 3) {
            url += `&term=${searchTerm}`;
        }
        */

        return fetch(url)
            .then((response: Response) => response.json());

        //return fetch(this.getFilteredBacklogUrl(currentPreset, currentUserId))
        //    .then((response: Response) => response.json());
    }


    public getPtItem(
        ptItemId: number,
    ): Promise<PtItemServer> {
        return fetch(this.getPtItemUrl(ptItemId))
            .then((response: Response) => response.json());
    }

    public insertPtItem(
        item: PtItem
    ): Promise<PtItemServer> {
        return fetch(this.postPtItemUrl(),
            {
                method: 'POST',
                body: JSON.stringify({ item: item }),
                headers: this.getJSONHeader()
            })
            .then((response: Response) => response.json());
    }

    public updatePtItem(
        item: PtItem,
    ): Promise<PtItemServer> {
        return fetch(this.putPtItemUrl(item.id),
            {
                method: 'PUT',
                body: JSON.stringify({ item: item }),
                headers: this.getJSONHeader()
            })
            .then((response: Response) => response.json());
    }

    public insertPtTask(
        taskToBe: PtTaskToBe,
        ptItemId: number
    ): Promise<PtTaskServer> {
        return fetch(this.postPtTaskUrl(), {
            method: 'POST',
            body: JSON.stringify({ task: taskToBe, itemId: ptItemId }),
            headers: this.getJSONHeader()
        })
            .then(response => response.json());
    }

    public updatePtTask(
        task: PtTask,
        ptItemId: number
    ): Promise<PtTaskServer> {
        return fetch(this.putPtTaskUrl(task.id), {
            method: 'PUT',
            body: JSON.stringify({ task: task, itemId: ptItemId }),
            headers: this.getJSONHeader()
        })
            .then(response => response.json());
    }

    public deletePtTask(
        task: PtTask,
        ptItemId: number
    ): Promise<boolean> {
        return fetch(this.deletePtTaskUrl(ptItemId, task.id), {
            method: 'POST'
        })
            .then(response => response.json());
    }


    public insertPtComment(
        commentToBe: PtCommentToBe,
        ptItemId: number
    ): Promise<PtCommentServer> {
        return fetch(this.postPtCommentUrl(), {
            method: 'POST',
            body: JSON.stringify({ comment: commentToBe, itemId: ptItemId }),
            headers: this.getJSONHeader()
        })
            .then(response => response.json());
    }

    private getJSONHeader() {
        return new Headers({
            'Content-Type': 'application/json'
        })
    }
}
