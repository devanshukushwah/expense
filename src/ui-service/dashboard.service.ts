import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import api from "@/lib/axios";

export const getDashboard = async () => {
  try {
    const response = await api.get(HttpUrlConfig.getDashboardUrl());
    return response?.data;
  } catch (error) {
    throw error;
  }
};
