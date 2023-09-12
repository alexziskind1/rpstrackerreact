import { useContext, useState } from "react";
import { useQuery } from "react-query";

import { DashboardFilter } from "../../repositories/dashboard.repository";
import { formatDateEnUs } from "../../../../core/helpers/date-utils";
import { ActiveIssuesComponent } from "../../components/active-issues/active-issues";
import { StatusCounts } from "../../models";
import { PtDashboardServiceContext } from "../../../../App";


type DateRange = {
    dateStart: Date;
    dateEnd: Date;
};


export function DashboardPage() {
    const dashboardService = useContext(PtDashboardServiceContext);

    const [filter, setFilter] = useState<DashboardFilter>({});

    function getQueryKey() {
        return ['items', filter];
    }

    const useStatusCounts = (...params: Parameters<typeof dashboardService.getStatusCounts>) => {
        return useQuery<StatusCounts, Error>(getQueryKey(), () => dashboardService.getStatusCounts(...params));
    }
    const queryResult = useStatusCounts(filter);
    const statusCounts = queryResult.data;

    function onMonthRangeTap(months: number) {
        const range = getDateRange(months);
        setFilter({
            userId: filter.userId,
            dateEnd: range.dateEnd,
            dateStart: range.dateStart
        });
    }

    function getDateRange(months: number): DateRange {
        const now = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - months);
        return {
            dateStart: start,
            dateEnd: now
        };
    }

    if (queryResult.isLoading) {
        return (
            <div>
                Loading...
            </div>
        );
    }
    
    if (!statusCounts) {
        return (
            <div>No data</div>
        );
    }

    return (
        <div className="dashboard">

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">

                <div className="col-md order-md-first text-center text-md-left">
                    <h2>
                        <span className="small text-uppercase text-muted d-block">Statistics</span>
                        {
                            (filter.dateStart && filter.dateEnd) && (
                                <span>  {formatDateEnUs(filter.dateStart)} - {formatDateEnUs(filter.dateEnd)}</span>
                            )
                        }
                    </h2>
                </div>

                <div className="btn-toolbar mb-2 mb-md-0" style={{gap: 20}}>
                    <div className="btn-group mr-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => onMonthRangeTap(3)}>3 Months</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => onMonthRangeTap(6)}>6 Months</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => onMonthRangeTap(12)}>1 Year</button>
                    </div >

                </div >
            </div >

            <div className="card">
                <h3 className="card-header">Active Issues</h3>
                <div className="card-block">

                    <ActiveIssuesComponent statusCounts={statusCounts} />

                    <div className="row">
                        <div className="col-sm-12">
                            <h3>All issues</h3>

                        </div>
                    </div>
                </div>
            </div >

        </div >
    );

}
