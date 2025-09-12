"use client";

import { AppConstants } from "@/common/AppConstants";
import CommonTable from "@/components/CommonTable";
import Header from "@/components/Header";
import { getSpends } from "@/services/spends.service";
import { Container } from "@mui/material";
import React from "react";

const columns = [
  { id: "amt", label: "Amount", pr: "₹" },
  { id: "cat", label: "Category" },
  { id: "desc", label: "Description" },
];

function page() {
  const [spends, setSpends] = React.useState([]);

  const fetchSpends = async () => {
    const response = await getSpends({ limit: 10, skip: 0 });

    if (response?.success) {
      const {
        data: { spends },
      } = response;
      setSpends(spends || []);
    }
  };
  React.useEffect(() => {
    fetchSpends();
  }, []);

  return (
    <>
      <Header />
      <Container sx={{ mt: AppConstants.GAP * 2, mb: AppConstants.GAP * 2 }}>
        <CommonTable columns={columns} data={spends} />
      </Container>
    </>
  );
}

export default page;
