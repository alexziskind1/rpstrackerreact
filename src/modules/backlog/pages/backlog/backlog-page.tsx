import React, { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
    const [searchParams, setSearchParams] = useSearchParams({q: '', preset: 'open'});
    const [searchInputVal, setSearchInputVal] = useState(searchParams.get('q') || '');

    function onSearchValChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchInputVal(e.target.value);
    }

    
    function doSearch(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setSearchParams((prev: URLSearchParams) => {
            prev.set('q', searchInputVal);
            return prev;
        });
    }


    const useItems = (...params: Parameters<typeof backlogService.getItems>) => {
        return useQuery<PtItem[], Error>(getQueryKey(), () => backlogService.getItems(...params));
    }

    const curPreset = (searchParams.get('preset') || 'open') as PresetType;
    const searchTerm = searchParams.get('q') || '';

    const queryResult = useItems(curPreset, searchTerm);

    const items = queryResult.data;

    function getQueryKey() {
        return ['items', searchParams.get('preset') || 'open', searchParams.get('q') || ''];
    }

    const addItemMutation = useMutation(async (newItem: PtNewItem) => {
        if (store.value.currentUser) {
            const createdItem = await backlogService.addNewPtItem(newItem, store.value.currentUser);
            return createdItem;
        }
    });

    
    const [isAddModalShowing, setIsAddModalShowing] = useState(false);

    function onSelectPresetTap(preset: PresetType) {
        setSearchInputVal('');
        setSearchParams((prev: URLSearchParams) => {    
            prev.set('preset', preset);
            prev.delete('q');
            return prev;
        });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        doSearch(e as any);
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
                    <AppPresetFilter selectedPreset={ searchParams.get('preset') as PresetType } onSelectPresetTap={onSelectPresetTap} />

                    <div className="btn-group mr-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={toggleModal}>Add</button>
                    </div>
                </div>
            </div>

            <div>
                <form className="input-group mb-3" onSubmit={handleSubmit}>
                    <input placeholder="Search..." type="text" defaultValue={searchInputVal} onChange={onSearchValChange} className="form-control"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={doSearch}>Search</button>
                    </div>
                </form>

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
