import React from "react";
import { PtItem } from "../../../../core/models/domain";
import { PtItemDetailsEditFormModel, ptItemToFormModel } from "../../../../shared/models/forms/pt-item-details-edit-form";
import { ItemType, PT_ITEM_STATUSES, PT_ITEM_PRIORITIES } from "../../../../core/constants";

interface PtItemDetailsComponentProps {
    item: PtItem;
    itemSaved: (item: PtItem) => void;
}

interface PtItemDetailsComponentState {
    itemForm: PtItemDetailsEditFormModel;
}

export class PtItemDetailsComponent extends React.Component<PtItemDetailsComponentProps, PtItemDetailsComponentState> {

    private itemForm: PtItemDetailsEditFormModel | undefined;
    public itemTypesProvider = ItemType.List.map((t) => t.PtItemType);
    public statusesProvider = PT_ITEM_STATUSES;
    public prioritiesProvider = PT_ITEM_PRIORITIES;

    constructor(props: any) {
        super(props);

        this.itemForm = ptItemToFormModel(this.props.item);
        this.state = {
            itemForm: ptItemToFormModel(this.props.item)
        };
    }

    public onFieldChange(e: any, formFieldName: string) {
        if (!this.itemForm) {
            return;
        }
        (this.itemForm as any)[formFieldName] = e.target.value;
    }

    public onNonTextFieldChange(e: any, formFieldName: string) {
        this.onFieldChange(e, formFieldName);
        this.notifyUpdateItem();
    }

    public onBlurTextField() {
        this.notifyUpdateItem();
    }

    private notifyUpdateItem() {
        if (!this.itemForm) {
            return;
        }

        const updatedItem = this.getUpdatedItem(this.props.item, this.itemForm);

        this.props.itemSaved(updatedItem);
    }

    private getUpdatedItem(item: PtItem, itemForm: PtItemDetailsEditFormModel): PtItem {
        const updatedItem = Object.assign({}, item, {
            title: itemForm.title,
            description: itemForm.description,
            type: itemForm.typeStr,
            status: itemForm.statusStr,
            priority: itemForm.priorityStr,
            estimate: itemForm.estimate,
            // assignee: this.selectedAssignee
        });
        return updatedItem;
    }

    public render() {
        if (!this.itemForm) {
            return null;
        }
        const itemForm = this.itemForm;
        return (
            <form>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Title</label>
                    <div className="col-sm-10">
                        <input className="form-control" defaultValue={itemForm.title} onBlur={() => this.onBlurTextField()} onChange={(e) => this.onFieldChange(e, 'title')} name="title" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Description</label>
                    <div className="col-sm-10">
                        <textarea className="form-control" defaultValue={itemForm.description} onBlur={() => this.onBlurTextField()} onChange={(e) => this.onFieldChange(e, 'description')} name="description"></textarea>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Item Type</label>
                    <div className="col-sm-10">
                        <select className="form-control" defaultValue={itemForm.typeStr} onChange={(e) => this.onNonTextFieldChange(e, 'typeStr')} name="itemType">
                            {
                                this.itemTypesProvider.map(t => {
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
                        <select className="form-control" defaultValue={itemForm.statusStr} onChange={(e) => this.onNonTextFieldChange(e, 'statusStr')} name="status">
                            {
                                this.statusesProvider.map(t => {
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
                        <input className="form-control" type="range" step="1" min="0" max="20" value={itemForm.estimate} onChange={(e) => this.onNonTextFieldChange(e, 'estimate')} name="estimate" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Priority</label>
                    <div className="col-sm-10">
                        <select className="form-control" defaultValue={itemForm.priorityStr} onChange={(e) => this.onNonTextFieldChange(e, 'priorityStr')} name="priority">
                            {
                                this.prioritiesProvider.map(t => {
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

            </form>
        );
    }
}
