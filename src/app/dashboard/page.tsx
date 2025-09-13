"use client";

import { ApiContextType } from "@/common/ApiContextType";
import { AppConstants } from "@/common/AppConstants";
import CommonTable, { Column } from "@/components/CommonTable";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { getSpends } from "@/services/spends.service";
import { Container, Divider } from "@mui/material";
import React from "react";
import DashboardSpend from "@/components/DashboardSpend";
import { getDashboard } from "@/services/dashboard.service";
import { AppUtil } from "@/utils/AppUtil";

const columns: Column[] = [
  { id: "amt", label: "Amount" },
  { id: "cat", label: "Category" },
  { id: "desc", label: "Description" },
];

function page() {
  const { loading } = useApiState();
  const dispact = useApiDispatch();
  const [spends, setSpends] = React.useState([]);
  const [dashboard, setDashboard] = React.useState({});

  const fetchSpends = async () => {
    dispact({ type: ApiContextType.START_FETCH_SPEND });

    const response = await getSpends({ limit: 10, skip: 0 });

    if (response?.success) {
      const {
        data: { spends },
      } = response;

      const formattedSpends = spends.map((spend) => ({
        ...spend,
        amt: AppUtil.formatMoney(spend.amt),
      }));

      setSpends(formattedSpends || []);
      dispact({ type: ApiContextType.STOP_FETCH_SPEND });
    }
  };

  const fetchDashboard = async () => {
    dispact({ type: ApiContextType.START_FETCH_DASHBOARD });
    const response = await getDashboard();
    if (response?.success) {
      const dashbaord = response?.data?.dashboard || {};
      setDashboard(dashbaord);
      dispact({ type: ApiContextType.STOP_FETCH_DASHBOARD });
    }
  };

  React.useEffect(() => {
    fetchSpends();
    fetchDashboard();
  }, []);

  return (
    <>
      <Header />
      <Container
        sx={{
          mt: AppConstants.GAP * 2,
          mb: AppConstants.GAP * 2,
          display: "flex",
          flexDirection: "column",
          gap: AppConstants.GAP * 2,
        }}
      >
        {loading.fetchDashboard ? (
          <Loader times={1} height={200} />
        ) : (
          <DashboardSpend data={dashboard} />
        )}

        {loading.fetchSpend ? (
          <Loader times={1} height={200} />
        ) : (
          <CommonTable columns={columns} data={spends} />
        )}
      </Container>
    </>
  );
}

export default page;
