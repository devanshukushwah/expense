"use client";

import { Spend as SpendInterface } from "@/collection/Spend.collection";
import { ApiContextType } from "@/common/ApiContextType";
import Header from "@/components/Header";
import Spend from "@/components/Spend";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { getCategories } from "@/services/categories.service";
import { createSpend } from "@/services/spends.service";
import LazyInvoke from "@/utils/LazyInvoke";
import { Container } from "@mui/material";
import React, { useEffect } from "react";

const defaultValue = (): SpendInterface => ({
  desc: "",
  amt: null,
  catId: null,
});

export default function Home() {
  const [spend, setSpend] = React.useState<SpendInterface>(defaultValue());
  const { categories, loading } = useApiState();
  const dispact = useApiDispatch();

  const handleSpendSubmit = async (data) => {
    dispact({ type: "START_ADD_SPEND" });
    const response = await createSpend(data);

    if (response?.success) {
      LazyInvoke({ callback: () => dispact({ type: "STOP_ADD_SPEND" }) });
      setSpend(defaultValue());
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
      <Container>
        <Spend
          categories={categories}
          loading={loading.addSpend}
          onSubmit={handleSpendSubmit}
          item={spend}
        />
      </Container>
    </>
  );
}
