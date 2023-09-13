import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import './backlog-page.css';

import { PresetType } from "../../../../core/models/domain/types";
import { PtItem } from "../../../../core/models/domain";
import { AppPresetFilter } from "../../../../shared/components/preset-filter/preset-filter";
import { PtNewItem } from "../../../../shared/models/dto/pt-new-item";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddItemModal } from "../../components/add-item-modal/add-item-modal";
import { BacklogList } from "../../components/backlog-list/backlog-list";
import { PtBacklogServiceContext, PtStoreContext } from "../../../../App";


export function BacklogPage() {
    const store = useContext(PtStoreContext);
    const backlogService = useContext(PtBacklogServiceContext);

    

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const { preset, search } = useParams() as {preset: PresetType, search: string};
    const [currentPreset, setCurrentPreset] = useState<PresetType>(preset ? preset : 'open');


    const [searchInputVal, setSearchInputVal] = useState(search ? search : '');
    const [searchTerm, setSearchTerm] = useState(search ? search : '');

    function onSearchValChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchInputVal(e.target.value);
    }

    function doSearch() {
        setSearchTerm(searchInputVal);
    }


    const useItems = (...params: Parameters<typeof backlogService.getItems>) => {
        return useQuery<PtItem[], Error>(getQueryKey(), () => backlogService.getItems(...params));
    }
    const queryResult = useItems(currentPreset, searchTerm);
    const items = queryResult.data;

    function getQueryKey() {
        return ['items', currentPreset, searchTerm];
    }

    const addItemMutation = useMutation(async (newItem: PtNewItem) => {
        if (store.value.currentUser) {
            const createdItem = await backlogService.addNewPtItem(newItem, store.value.currentUser);
            return createdItem;
        }
    });
    
    useEffect(()=>{
        navigate(`/backlog/${[currentPreset]}`);
    },[currentPreset]);

    
    useEffect(()=>{
        if (searchTerm && searchTerm.length >= 3) {
            navigate(`/backlog/${[currentPreset]}?search=${searchTerm}`);
        }
    },[searchTerm]);
    
    
    const [isAddModalShowing, setIsAddModalShowing] = useState(false);

    function onSelectPresetTap(preset: PresetType) {
        setSearchTerm('');
        setSearchInputVal('');
        setCurrentPreset(preset);
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
            <div>No items</div>
        );
    }



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

            <div>
                <div className="input-group mb-3">
                    <input placeholder="Search..." type="text" value={searchInputVal} onChange={onSearchValChange} className="form-control"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={doSearch}>Search</button>
                    </div>
                </div>

                <BacklogList items={items} />
            </div>
            

            <AddItemModal 
                onNewItemSave={onNewItemSave} 
                modalShowing={isAddModalShowing}
                setIsAddModalShowing={setIsAddModalShowing}
                />
                
        </React.Fragment >
    );
}
