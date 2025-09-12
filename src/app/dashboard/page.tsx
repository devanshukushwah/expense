"use client";

import { ApiContextType } from "@/common/ApiContextType";
import { AppConstants } from "@/common/AppConstants";
import CommonTable, { Column } from "@/components/CommonTable";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { getSpends } from "@/services/spends.service";
import LazyInvoke from "@/utils/LazyInvoke";
import { Container } from "@mui/material";
import React from "react";

const columns: Column[] = [
  { id: "amt", label: "Amount", pr: "₹", width: "auto" },
  { id: "cat", label: "Category" },
  { id: "desc", label: "Description" },
];

function page() {
  const { loading } = useApiState();
  const dispact = useApiDispatch();
  const [spends, setSpends] = React.useState([]);

  const fetchSpends = async () => {
    dispact({ type: ApiContextType.START_FETCH_SPEND });

    const response = await getSpends({ limit: 10, skip: 0 });

    if (response?.success) {
      const {
        data: { spends },
      } = response;
      setSpends(spends || []);
      LazyInvoke({
        callback: () => dispact({ type: ApiContextType.STOP_FETCH_SPEND }),
      });
    }
  };
  React.useEffect(() => {
    fetchSpends();
  }, []);

  return (
    <>
      <Header />
      <Container sx={{ mt: AppConstants.GAP * 2, mb: AppConstants.GAP * 2 }}>
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
