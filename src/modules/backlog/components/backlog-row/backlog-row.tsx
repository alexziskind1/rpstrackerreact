import { useHistory } from "react-router-dom";
import { ItemType } from "../../../../core/constants";
import { PtItem } from "../../../../core/models/domain";
import { getIndicatorClass } from "../../../../shared/helpers/priority-styling";

export type BacklogRowProps = {
    item: PtItem;
}

export function BacklogRow(props: BacklogRowProps) {
    
    const { item: i } = props;
    const history = useHistory();

    function getIndicatorImage(item: PtItem) {
        return ItemType.imageResFromType(item.type);
    }

    function getPriorityClass(item: PtItem): string {
        const indicatorClass = getIndicatorClass(item.priority);
        return indicatorClass;
    }
    
    function listItemTap(item: PtItem) {
        // navigate to detail page
        history.push(`/detail/${item.id}`);
    }

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
}


