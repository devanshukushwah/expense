"use client";

import { Spend as SpendInterface } from "@/collection/Spend.collection";
import { ApiContextType } from "@/common/ApiContextType";
import { AppConstants } from "@/common/AppConstants";
import { spendDefaultValue } from "@/common/DefaultValue";
import Header from "@/components/Header";
import Spend from "@/components/Spend";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { getCategories } from "@/services/categories.service";
import { createSpend } from "@/services/spends.service";
import LazyInvoke from "@/utils/LazyInvoke";
import { Container } from "@mui/material";
import React, { useEffect } from "react";

export default function Home() {
  const [spend, setSpend] = React.useState<SpendInterface>(spendDefaultValue());
  const { categories, loading } = useApiState();
  const dispact = useApiDispatch();

  const handleSpendSubmit = async (data) => {
    dispact({ type: ApiContextType.START_ADD_SPEND });
    const response = await createSpend(data);

    if (response?.success) {
      LazyInvoke({
        callback: () => dispact({ type: ApiContextType.STOP_ADD_SPEND }),
      });
      setSpend(spendDefaultValue());
    }
  };

  const fetchCategories = async () => {
    const response = await getCategories();
    if (response?.success) {
      const categories = response?.data?.categories || [];
      dispact({
        type: ApiContextType.SET_CATEGORIES,
        payload: { categories },
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Header />
      <Container sx={{ mt: AppConstants.GAP * 2 }}>
        <Spend
          categories={categories}
          loading={loading.addSpend}
          onSubmit={handleSpendSubmit}
          item={spend}
          buttonLabel="Add Spend"
        />
      </Container>
    </>
  );
}
