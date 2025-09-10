import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import api from "@/lib/axios";

export const createSpend = async (data) => {
  try {
    const response = await api.post(HttpUrlConfig.postSpendUrl(), data);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
