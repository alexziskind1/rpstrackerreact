import React from "react";
import { PtItem } from "../../../../core/models/domain";

interface PtItemTasksComponentProps {
    item: PtItem;
}

export class PtItemTasksComponent extends React.Component<PtItemTasksComponentProps, any> {

    public render() {
        return (
            <div>tasks</div>
        );
    }
}
