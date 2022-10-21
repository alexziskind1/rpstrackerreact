import React, { useEffect, useState } from "react";
import { PtItem, PtUser } from "../../../../core/models/domain";
import { PtItemDetailsEditFormModel, ptItemToFormModel } from "../../../../shared/models/forms/pt-item-details-edit-form";
import { ItemType, PT_ITEM_STATUSES, PT_ITEM_PRIORITIES } from "../../../../core/constants";
import { Observable } from "rxjs";
import { AssigneeListModal } from "../assignee-list-modal/assignee-list-modal";

interface PtItemDetailsComponentProps {
    item: PtItem;
    itemSaved: (item: PtItem) => void;
    usersRequested: () => void;
    users$: Observable<PtUser[]>;
}

export function PtItemDetailsComponent(props: PtItemDetailsComponentProps) {

    const statusesProvider = PT_ITEM_STATUSES;
    const prioritiesProvider = PT_ITEM_PRIORITIES;
    const itemTypesProvider = ItemType.List.map((t) => t.PtItemType);

    const [itemForm, setItemForm] = useState(ptItemToFormModel(props.item));
    const [users, setUsers] = useState<PtUser[]>([]);
    const [modalIsShowing, setModalIsShowing] = useState(false);
    const [selectedAssignee, setSelectedAssignee] = useState<PtUser>(props.item.assignee);
    useEffect(()=>{
        notifyUpdateItem();
    }, [selectedAssignee]);

    
    function onFieldChange(e: any, formFieldName: string) {
        if (!itemForm) {
            return;
        }
        (itemForm as any)[formFieldName] = e.target.value;
    }

    function onNonTextFieldChange(e: any, formFieldName: string) {
        onFieldChange(e, formFieldName);
        notifyUpdateItem();
    }

    function onBlurTextField() {
        notifyUpdateItem();
    }

    function notifyUpdateItem() {
        if (!itemForm) {
            return;
        }
        const updatedItem = getUpdatedItem(props.item, itemForm, selectedAssignee!);
        props.itemSaved(updatedItem);
    }

    function getUpdatedItem(item: PtItem, itemForm: PtItemDetailsEditFormModel, assignee: PtUser): PtItem {
        const updatedItem = Object.assign({}, item, {
            title: itemForm.title,
            description: itemForm.description,
            type: itemForm.typeStr,
            status: itemForm.statusStr,
            priority: itemForm.priorityStr,
            estimate: itemForm.estimate,
            assignee: assignee
        });
        return updatedItem;
    }

    function assigneePickerOpen() {
        props.users$.subscribe((users: PtUser[]) => {
            if (users.length > 0) {
                setUsers(users);
                setModalIsShowing(true);
            }
        });

        props.usersRequested();
    }

    function selectAssignee(u: PtUser) {
        setSelectedAssignee(u);
        setItemForm({ ...itemForm, assigneeName: u.fullName });
        setModalIsShowing(false);
        notifyUpdateItem();
    }

    if (!itemForm) {
        return null;
    }

    return (
        <React.Fragment>
            <form>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Title</label>
                    <div className="col-sm-10">
                        <input className="form-control" defaultValue={itemForm.title} onBlur={() => onBlurTextField()} onChange={(e) => onFieldChange(e, 'title')} name="title" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Description</label>
                    <div className="col-sm-10">
                        <textarea className="form-control" defaultValue={itemForm.description} onBlur={() => onBlurTextField()} onChange={(e) => onFieldChange(e, 'description')} name="description"></textarea>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Item Type</label>
                    <div className="col-sm-10">
                        <select className="form-control" defaultValue={itemForm.typeStr} onChange={(e) => onNonTextFieldChange(e, 'typeStr')} name="itemType">
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

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Status</label>
                    <div className="col-sm-10">
                        <select className="form-control" defaultValue={itemForm.statusStr} onChange={(e) => onNonTextFieldChange(e, 'statusStr')} name="status">
                            {
                                statusesProvider.map(t => {
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

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Estimate</label>
                    <div className="col-sm-10">
                        <input className="form-control" type="range" step="1" min="0" max="20" value={itemForm.estimate} onChange={(e) => onNonTextFieldChange(e, 'estimate')} name="estimate" style={{ width: 300 }} />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Priority</label>
                    <div className="col-sm-10">
                        <select className="form-control" defaultValue={itemForm.priorityStr} onChange={(e) => onNonTextFieldChange(e, 'priorityStr')} name="priority">
                            {
                                prioritiesProvider.map(t => {
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

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Assignee</label>

                    <div className="col-sm-10">
                        <img src={selectedAssignee!.avatar} className="li-avatar rounded" />
                        <span>{itemForm.assigneeName}</span>

                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => assigneePickerOpen()}>Pick assignee</button>
                    </div>
                </div>
            </form>

            <AssigneeListModal 
                users={users} 
                modalIsShowing={modalIsShowing} 
                setModalIsShowing={setModalIsShowing} 
                selectAssignee={selectAssignee} />


        </React.Fragment>
    );
   
}
