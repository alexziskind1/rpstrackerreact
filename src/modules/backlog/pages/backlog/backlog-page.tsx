import React, { useEffect, useState } from "react";
import { BacklogService } from "../../services/backlog.service";
import { BacklogRepository } from "../../repositories/backlog.repository";
import { Store } from "../../../../core/state/app-store";
import { PresetType } from "../../../../core/models/domain/types";
import { PtItem } from "../../../../core/models/domain";
import { ItemType } from "../../../../core/constants";

import './backlog-page.css';

import { AppPresetFilter } from "../../../../shared/components/preset-filter/preset-filter";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import { PtNewItem } from "../../../../shared/models/dto/pt-new-item";
import { EMPTY_STRING } from "../../../../core/helpers";
import { getIndicatorClass } from "../../../../shared/helpers/priority-styling";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddItemModal } from "../../components/add-item-modal/add-item-modal";




const store: Store = new Store();
const backlogRepo: BacklogRepository = new BacklogRepository();
const backlogService: BacklogService = new BacklogService(backlogRepo, store);

type GetPtItemsParams = Parameters<typeof backlogService.getItems>;

export function BacklogPage() {

    const queryClient = useQueryClient();
    const history = useHistory();
    
    const { preset } = useParams() as {preset: PresetType};
    const [currentPreset, setCurrentPreset] = useState<PresetType>(preset ? preset : 'open');

    const useItems = (...params: GetPtItemsParams) => {
        return useQuery<PtItem[], Error>(getQueryKey(), () => backlogService.getItems(...params));
    }
    const queryResult = useItems(currentPreset);
    const items = queryResult.data;

    function getQueryKey() {
        return ['items', currentPreset];
    }

    const addItemMutation = useMutation(async (newItem: PtNewItem) => {
        if (store.value.currentUser) {
            const createdItem = await backlogService.addNewPtItem(newItem, store.value.currentUser);
            return createdItem;
        }
    });
    
    useEffect(()=>{
        history.push(`/backlog/${[currentPreset]}`);
    },[currentPreset]);
    
    const [isAddModalShowing, setIsAddModalShowing] = useState(false);


    function getIndicatorImage(item: PtItem) {
        return ItemType.imageResFromType(item.type);
    }

    function getPriorityClass(item: PtItem): string {
        const indicatorClass = getIndicatorClass(item.priority);
        return indicatorClass;
    }

    function onSelectPresetTap(preset: PresetType) {
        setCurrentPreset(preset);
    }

    function listItemTap(item: PtItem) {
        // navigate to detail page
        history.push(`/detail/${item.id}`);
    }

    function toggleModal() {
        setIsAddModalShowing(!isAddModalShowing);
    }

    function onNewItemSave(newItem: PtNewItem) {
        return addItemMutation.mutateAsync(newItem, {
            onSuccess(createdItem, variables, context) {
                queryClient.invalidateQueries(getQueryKey());
            },
        });
    }


    if (queryResult.isLoading) {
        return (
            <div>
                Loading...
            </div>
        );
    }
    
   if (!items) {
    return (
        <div>no items</div>
    );
   }


    const rows = items.map(i => {
        return (
            <tr key={i.id} className="pt-table-row" onClick={(e) => listItemTap(i)}>
                <td>
                    <img src={getIndicatorImage(i)} className="backlog-icon" />
                </td>
                <td>
                    <img src={i.assignee.avatar} className="li-avatar rounded mx-auto d-block" />
                </td>
                <td>
                    <span className="li-title">{i.title}</span>
                </td>

                <td>
                    <span>{i.status}</span>
                </td>

                <td>
                    <span className={'badge ' + getPriorityClass(i)}>{i.priority}
                    </span>
                </td>
                <td><span className="li-estimate">{i.estimate}</span></td>
                <td><span className="li-date">{i.dateCreated.toDateString()}</span></td>
            </tr>
        );
    });



    return (
        <React.Fragment>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                <h1 className="h2">Backlog</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <AppPresetFilter selectedPreset={currentPreset} onSelectPresetTap={onSelectPresetTap} />

                    <div className="btn-group mr-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={toggleModal}>Add</button>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-sm table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Assignee</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Estimate</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>

            <AddItemModal 
                onNewItemSave={onNewItemSave} 
                modalShowing={isAddModalShowing}
                setIsAddModalShowing={setIsAddModalShowing}
                />
                
        </React.Fragment >
    );
}
