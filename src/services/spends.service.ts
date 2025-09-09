import { HttpUrlConfig } from "@/core/HttpUrlConfig";

const { default: api } = require("@/lib/axios");

export const createSpend = async (data) => {
  try {
    const response = await api.post(HttpUrlConfig.postSpendUrl(), data);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
