"use client";

import { ApiContextType } from "@/common/ApiContextType";
import { AppConstants } from "@/common/AppConstants";
import CommonTable, { Column } from "@/components/CommonTable";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { deleteSpend, getSpends } from "@/ui-service/spends.service";
import { Container } from "@mui/material";
import React from "react";
import DashboardSpend from "@/components/DashboardSpend";
import { getDashboard } from "@/ui-service/dashboard.service";
import { AppUtil } from "@/utils/AppUtil";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Spend } from "@/collection/Spend.collection";
import DateUtil from "@/utils/DateUtil";
import MonthYearWithIcon from "@/components/MonthYearWithIcon";

const columns: Column[] = [
  { id: "amt", label: "Amount" },
  { id: "cat", label: "Category" },
  { id: "desc", label: "Description" },
  { id: "createdAt", label: "Date" },
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

  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const [monthYear, setMonthYear] = React.useState({ month, year });

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
        createdAt: DateUtil.convertUTCToISTDate(spend.createdAt),
      }));

      setSpends(formattedSpends || []);
      dispact({ type: ApiContextType.STOP_FETCH_SPEND });
    }
  };

  const fetchDashboard = async () => {
    dispact({ type: ApiContextType.START_FETCH_DASHBOARD });
    const response = await getDashboard(monthYear);
    if (response?.success) {
      const dashbaord = response?.data?.dashboard || {};
      setDashboard(dashbaord);
      dispact({ type: ApiContextType.STOP_FETCH_DASHBOARD });
    }
  };

  React.useEffect(() => {
    fetchDashboard();
  }, [monthYear]);

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

  const handleMonthYearSubmit = ({ month, year }) => {
    if (!month || !year) {
      console.error("Month and Year are required");
      return;
    }
    setMonthYear({ month, year });
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
          <DashboardSpend data={dashboard}>
            <MonthYearWithIcon
              monthYear={monthYear}
              onSumit={handleMonthYearSubmit}
            />
          </DashboardSpend>
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
