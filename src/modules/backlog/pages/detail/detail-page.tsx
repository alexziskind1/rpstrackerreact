import React from "react";

import { PtItem } from "../../../../core/models/domain";
import { DetailScreenType } from "../../../../shared/models/ui/types/detail-screens";
import { Store } from "../../../../core/state/app-store";
import { BacklogRepository } from "../../repositories/backlog.repository";
import { BacklogService } from "../../services/backlog.service";
import { PtItemDetailsComponent } from "../../components/item-details/pt-item-details";
import { PtItemTasksComponent } from "../../components/item-tasks/pt-item-tasks";
import { debug } from "util";

interface DetailPageState {
    item: PtItem | undefined;
    selectedDetailsScreen: DetailScreenType;
}

export class DetailPage extends React.Component<any, DetailPageState> {

    private store: Store = new Store();
    private backlogRepo: BacklogRepository = new BacklogRepository();
    private backlogService: BacklogService = new BacklogService(this.backlogRepo, this.store);

    private itemId = 0;

    constructor(props: any) {
        super(props);

        const { id, screen } = this.props.match.params;
        this.itemId = id;

        this.state = {
            item: undefined,
            selectedDetailsScreen: screen ? screen : 'details'
        };
    }

    public componentDidMount() {
        this.refresh();
    }

    public componentDidUpdate(prevsProps: any, prevState: DetailPageState) {

    }

    private refresh() {
        this.backlogService.getPtItem(this.itemId)
            .then(item => {
                this.setState({
                    item: item
                });

                // this.tasks$.next(item.tasks);
                // this.comments$.next(item.comments);
            });
    }

    public onScreenSelected(screen: DetailScreenType) {
        this.setState({
            selectedDetailsScreen: screen
        });
        this.props.history.push(`/detail/${this.itemId}/${screen}`);
    }

    public onItemSaved(item: PtItem) {
        this.backlogService.updatePtItem(item)
            .then((updateItem: PtItem) => {
                this.setState({
                    item: updateItem
                });
            });
    }

    private screenRender(screen: DetailScreenType, item: PtItem) {
        switch (screen) {
            case 'details':
                return <PtItemDetailsComponent item={item} itemSaved={(item) => this.onItemSaved(item)} />;
            case 'tasks':
                return <PtItemTasksComponent item={item} />;
            default:
                return <PtItemDetailsComponent item={item} itemSaved={(item) => this.onItemSaved(item)} />;
        }
    }



    public render() {
        const item = this.state.item;

        if (!item) {
            return null;
        }
        return (

            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                    <h1 className="h2">{item.title}</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group mr-2">
                            <button type="button" onClick={(e) => this.onScreenSelected('details')} className={'btn btn-sm btn-outline-secondary ' + this.state.selectedDetailsScreen === 'details' ? 'active' : ''}>Details</button>

                            <button type="button" onClick={(e) => this.onScreenSelected('tasks')} className={"btn btn-sm btn-outline-secondary " + this.state.selectedDetailsScreen === 'tasks' ? 'active' : ''}>Tasks</button>

                            <button type="button" onClick={(e) => this.onScreenSelected('chitchat')} className={"btn btn-sm btn-outline-secondary " + this.state.selectedDetailsScreen === 'chitchat' ? 'active' : ''}>Chitchat</button>
                        </div>
                    </div>
                </div>

                {this.screenRender(this.state.selectedDetailsScreen, item)}

            </div>
        );
    }
}
