"use client";

import { ApiContextType } from "@/common/ApiContextType";
import { AppConstants } from "@/common/AppConstants";
import CommonTable, { Column } from "@/components/CommonTable";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { deleteSpend, getSpends } from "@/services/spends.service";
import { Container } from "@mui/material";
import React from "react";
import DashboardSpend from "@/components/DashboardSpend";
import { getDashboard } from "@/services/dashboard.service";
import { AppUtil } from "@/utils/AppUtil";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Spend } from "@/collection/Spend.collection";

const columns: Column[] = [
  { id: "amt", label: "Amount" },
  { id: "cat", label: "Category" },
  { id: "desc", label: "Description" },
  { id: "null", label: "Action" },
];

function page() {
  const { loading, dialog } = useApiState();
  const dispact = useApiDispatch();
  const [spends, setSpends] = React.useState([]);
  const [dashboard, setDashboard] = React.useState({});
  const [paginationData, setPaginationData] = React.useState({
    count: 0,
    page: 0,
    rowsPerPage: 10,
  });
  const router = useRouter();

  const fetchSpends = async ({ limit = 10, skip = 0 }) => {
    dispact({ type: ApiContextType.START_FETCH_SPEND });

    const response = await getSpends({ limit, skip });

    if (response?.success) {
      const {
        data: { spends, count },
      } = response;

      setPaginationData({
        ...paginationData,
        count: count || 0,
      });

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
    fetchDashboard();
  }, []);

  const handlePaginationChange = () => {
    const { page, rowsPerPage } = paginationData;
    const skip = page * rowsPerPage;
    const limit = rowsPerPage;
    fetchSpends({ limit, skip });
  };

  React.useEffect(handlePaginationChange, [
    paginationData.page,
    paginationData.rowsPerPage,
  ]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPaginationData({
      ...paginationData,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaginationData({
      ...paginationData,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const handleOnEdit = (row: any): void => {
    router.push(`edit/${row._id}`);
  };

  const handleOnDelete = async (row: any) => {
    const response = await deleteSpend(row._id);
    if (response?.success) {
      fetchSpends({});
      fetchDashboard();
      dispact({ type: ApiContextType.CLOSE_DIALOG });
    }
  };

  const handleOpenDeleteDialog = (row: Spend) => {
    dispact({
      type: ApiContextType.OPEN_DIALOG,
      payload: {
        onConfirmCallback: () => {
          handleOnDelete(row);
        },
        message: `Are you sure want to delete expense of ${row.amt}`,
        title: "Delete Confirm",
      },
    });
  };

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
          <CommonTable
            columns={columns}
            data={spends}
            count={paginationData.count}
            page={paginationData.page}
            rowsPerPage={paginationData.rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onEdit={handleOnEdit}
            onDelete={handleOpenDeleteDialog}
          />
        )}
      </Container>
      <ConfirmDialog />
    </>
  );
}

export default page;
