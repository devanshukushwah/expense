"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import { Container } from "@mui/material";
import Spend from "@/components/Spend";
import { useApiState } from "@/context/ApiStateContext";
import { createSpend } from "@/services/spends.service";

export default function Home() {
  const { categories } = useApiState();

  const handleSpendSubmit = async (data) => {
    const response = await createSpend(data);
  };

  return (
    <>
      <Header />
      <Container>
        <Spend categories={categories} onSubmit={handleSpendSubmit} />
      </Container>
    </>
  );
}
