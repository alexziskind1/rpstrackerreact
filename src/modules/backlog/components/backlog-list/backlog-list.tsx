import { PtItem } from "../../../../core/models/domain";
import { BacklogRow } from "../backlog-row/backlog-row";

export type BacklogListProps = {
    items: PtItem[];
};

export function BacklogList(props: BacklogListProps) {

    const rows = props.items.map(i => {
        return (
            <BacklogRow key={i.id} item={i} />
        );
    });

    return (
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
    );
}