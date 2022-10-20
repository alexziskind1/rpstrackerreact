import React, { useEffect, useRef, useState } from "react";
import { BacklogService } from "../../services/backlog.service";
import { BacklogRepository } from "../../repositories/backlog.repository";
import { Store } from "../../../../core/state/app-store";
import { PresetType } from "../../../../core/models/domain/types";
import { PtItem } from "../../../../core/models/domain";
import { ItemType } from "../../../../core/constants";

import './backlog-page.css';

import { AppPresetFilter } from "../../../../shared/components/preset-filter/preset-filter";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { PtNewItem } from "../../../../shared/models/dto/pt-new-item";
import { EMPTY_STRING } from "../../../../core/helpers";
import { getIndicatorClass } from "../../../../shared/helpers/priority-styling";
import { useHistory } from "react-router-dom";


interface BacklogPageState {
    currentPreset: PresetType;
    items: PtItem[];
    showAddModal: boolean;
    newItem: PtNewItem;
}

const initModalNewItem = (): PtNewItem =>  {
    return {
        title: EMPTY_STRING,
        description: EMPTY_STRING,
        typeStr: 'PBI'
    };
}

const store: Store = new Store();
const backlogRepo: BacklogRepository = new BacklogRepository();
const backlogService: BacklogService = new BacklogService(backlogRepo, store);


export function BacklogPage(props: any) {

    const history = useHistory();


    const itemTypesProvider = ItemType.List.map((t) => t.PtItemType);
    const { preset } = props.match.params;
    const [currentPreset, setCurrentPreset] = useState<PresetType>(preset ? preset : 'open');

    useEffect(()=>{
        refresh();
    }, [currentPreset]);

    const [items, setItems] = useState<PtItem[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newItem, setNewItem] = useState(initModalNewItem());


    function getIndicatorImage(item: PtItem) {
        return ItemType.imageResFromType(item.type);
    }

    function getPriorityClass(item: PtItem): string {
        const indicatorClass = getIndicatorClass(item.priority);
        return indicatorClass;
    }

    function onSelectPresetTap(preset: PresetType) {
        setCurrentPreset(preset);
        history.push(`/backlog/${[preset]}`);
    }

    function refresh() {
        backlogService.getItems(currentPreset)
            .then(ptItems => {
                setItems(ptItems);
            });
    }

    function listItemTap(item: PtItem) {
        // navigate to detail page
        history.push(`/detail/${item.id}`);
    }


    function toggleModal() {
        setShowAddModal(!showAddModal);
    }

    function onFieldChange(e: any, formFieldName: string) {
        if (!newItem) {
            return;
        }
        setNewItem({ ...newItem, [formFieldName]: e.target.value });
    }

    function onAddSave() {
        if (store.value.currentUser) {
            backlogService.addNewPtItem(newItem, store.value.currentUser)
                .then((nextItem: PtItem) => {
                    setShowAddModal(false);
                    setNewItem(initModalNewItem());
                    setItems([nextItem, ...items]);

                });
        }
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
                    <AppPresetFilter selectedPreset={currentPreset} onSelectPresetTap={(p) => onSelectPresetTap(p)} />

                    <div className="btn-group mr-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => toggleModal()}>Add</button>
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

            <Modal isOpen={showAddModal} toggle={() => toggleModal()} className={props.className}>
                <div className="modal-header">
                    <h4 className="modal-title" id="modal-basic-title">Add New Item</h4>
                    <button type="button" className="close" onClick={() => toggleModal()} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <ModalBody>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Title</label>
                            <div className="col-sm-10">
                                <input className="form-control" defaultValue={newItem.title} onChange={(e) => onFieldChange(e, 'title')} name="title" />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Description</label>
                            <div className="col-sm-10">
                                <textarea className="form-control" defaultValue={newItem.description} onChange={(e) => onFieldChange(e, 'description')} name="description"></textarea>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Item Type</label>
                            <div className="col-sm-10">
                                <select className="form-control" defaultValue={newItem.typeStr} onChange={(e) => onFieldChange(e, 'typeStr')} name="itemType">
                                    {
                                        itemTypesProvider.map(t => {
                                            return (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                    </form >
                </ModalBody >
                <ModalFooter>
                    <Button color="secondary" onClick={() => toggleModal()}>Cancel</Button>
                    <Button color="primary" onClick={() => onAddSave()}>Save</Button>{' '}

                </ModalFooter>
            </Modal >


        </React.Fragment >

    );
    
}
