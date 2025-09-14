"use client";

import { ApiContextType } from "@/common/ApiContextType";
import { AppConstants } from "@/common/AppConstants";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Spend from "@/components/Spend";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { getCategories } from "@/services/categories.service";
import { getSpend, updateSpend } from "@/services/spends.service";
import LazyInvoke from "@/utils/LazyInvoke";
import { Container } from "@mui/material";
import React, { use, useEffect } from "react";

function Page({ params }) {
  const { spendId } = use(params); // Uncomment if you need spendId
  const [spend, setSpend] = React.useState(null);
  const { categories, loading } = useApiState();
  const dispact = useApiDispatch();

  const fetchSpend = async (spendId: string) => {
    dispact({ type: ApiContextType.START_FETCH_ONE_SPEND });
    // Simulate an async operation, e.g., fetching data
    const response = await getSpend(spendId);
    if (response.success) {
      setSpend(response.data.spend);
      dispact({ type: ApiContextType.STOP_FETCH_ONE_SPEND });
    }
  };

  useEffect(() => {
    fetchSpend(spendId);
  }, [spendId]);

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

  const handleSpendUpdate = async (data) => {
    dispact({ type: ApiContextType.START_UPDATE_SPEND });
    // Implement the update logic here
    const response = await updateSpend(spendId, data);
    if (response?.success) {
      setSpend(response.data.spend);
      LazyInvoke({
        callback: () => dispact({ type: ApiContextType.STOP_UPDATE_SPEND }),
      });
    }
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: AppConstants.GAP * 2 }}>
        {loading.fetchOneSpend ? (
          <Loader times={1} height={200} />
        ) : (
          <Spend
            categories={categories}
            item={spend}
            buttonLabel="Update Spend"
            onSubmit={handleSpendUpdate}
            loading={loading.updateSpend}
          />
        )}
      </Container>
    </>
  );
}

export default Page;
