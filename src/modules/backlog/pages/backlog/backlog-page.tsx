import React from "react";
import { BacklogService } from "../../services/backlog.service";
import { BacklogRepository } from "../../repositories/backlog.repository";
import { Store } from "../../../../core/state/app-store";
import { PresetType } from "../../../../core/models/domain/types";
import { PtItem } from "../../../../core/models/domain";
import { ItemType } from "../../../../core/constants";

import './backlog-page.css';
import { PriorityEnum } from "../../../../core/models/domain/enums";
import { getIndicatorClass } from "../../../../core/models/domain/enums/priority-helpers";
import { AppPresetFilter } from "../../../../shared/components/preset-filter/preset-filter";


interface BacklogPageState {
    currentPreset: PresetType;
    items: PtItem[];
}

export class BacklogPage extends React.Component<any, BacklogPageState> {

    private store: Store = new Store();
    private backlogRepo: BacklogRepository = new BacklogRepository();
    private backlogService: BacklogService = new BacklogService(this.backlogRepo, this.store);

    public items: PtItem[] = [];

    constructor(props: any) {
        super(props);
        const { preset } = this.props.match.params;
        this.state = {
            currentPreset: preset ? preset : 'open',
            items: []
        };
    }

    public componentDidMount() {
        this.refresh();
    }

    public componentDidUpdate(prevsProps: any, prevState: BacklogPageState) {
        if (this.state.currentPreset !== prevState.currentPreset) {
            this.refresh();
        }
    }

    public getIndicatorImage(item: PtItem) {
        return ItemType.imageResFromType(item.type);
    }

    public getPriorityClass(item: PtItem): string {
        const indicatorClass = getIndicatorClass(item.priority);
        return indicatorClass;
    }

    private onSelectPresetTap(preset: PresetType) {
        this.setState({
            currentPreset: preset
        });
        this.props.history.push(`/backlog/${[preset]}`);
    }

    private refresh() {
        this.backlogService.getItems(this.state.currentPreset)
            .then(ptItems => {
                this.setState({
                    items: ptItems
                });
            });
    }

    public listItemTap(item: PtItem) {
        // navigate to detail page
        this.props.history.push(`/detail/${item.id}`);
    }

    public render() {
        const rows = this.state.items.map(i => {
            return (
                <tr key={i.id} className="pt-table-row" onClick={(e) => this.listItemTap(i)}>
                    <td>
                        <img src={this.getIndicatorImage(i)} className="backlog-icon" />
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
                        <span className={'badge ' + this.getPriorityClass(i)}>{i.priority}
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
                        <AppPresetFilter selectedPreset={this.state.currentPreset} onSelectPresetTap={(p) => this.onSelectPresetTap(p)} />

                        <div className="btn-group mr-2">

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

            </React.Fragment>

        );
    }
}
