// import { Table } from "../components/table";
import DashboardHeading from "../modules/dashboard/DashboardHeading";
import React, { useEffect } from "react";

const DashboardPage = () => {
    useEffect(() => {
        document.title = 'Dashboard';
    }, []);

    return (
        <div>
            <DashboardHeading
                title="Dashboard"
                desc="Overview dashboard monitor"
            ></DashboardHeading>
        </div>
    );
};

export default DashboardPage;