import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/authContext";
import NotFoundPage from "../../pages/NotFoundPage";
import _ from 'lodash';

const DashboardStyles = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  .dashboard {
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 40px;
      color: ${(props) => props.theme.primary};
      letter-spacing: 1px;
    }
    &-main {
      display: grid;
      grid-template-columns: 300px minmax(0, 1fr);
      padding: 40px 20px;
      gap: 0 40px;
      align-items: start;
    }
  }
`;

const DashboardLayout = () => {
  const { userInfo } = useAuth();
  if (_.isEmpty(userInfo)) return <NotFoundPage />

  return (
    <DashboardStyles>
      <DashboardHeader />
      <div className="dashboard-main">
        <Sidebar />
        <div className="dashboard-children">
          <Outlet />
        </div>
      </div>
    </DashboardStyles>
  );
};

export default DashboardLayout;