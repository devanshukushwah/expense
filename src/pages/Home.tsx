"use client";

import { Spend as SpendInterface } from "@/collection/Spend.collection";
import { AppConstants } from "@/common/AppConstants";
import { spendDefaultValue } from "@/common/DefaultValue";
import Header from "@/components/Header";
import Spend from "@/components/Spend";
import { createSpend } from "@/ui-service/spends.service";
import LazyInvoke from "@/utils/LazyInvoke";
import { Container } from "@mui/material";
import React from "react";

export default function Home({ categories }) {
  const [spend, setSpend] = React.useState<SpendInterface>(spendDefaultValue());
  const [addSpendLoading, setAddSpendLoading] = React.useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const handleSpendSubmit = async (data) => {
    try {
      setAddSpendLoading(true);
      const response = await createSpend(data);
      if (response?.success) {
        LazyInvoke({
          callback: () => setAddSpendLoading(false),
        });
        setSpend(spendDefaultValue());
      }
    } catch (error) {
      setAddSpendLoading(false);
      setErrorMessage("Failed to add spend. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: AppConstants.GAP * 2 }}>
        <Spend
          categories={categories}
          loading={addSpendLoading}
          onSubmit={handleSpendSubmit}
          item={spend}
          buttonLabel="Add Spend"
          errorMessage={errorMessage}
        />
      </Container>
    </>
  );
}
