import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import api from "@/lib/axios";

export const getDashboard = async (data) => {
  try {
    const response = await api.get(HttpUrlConfig.getDashboardUrl(data));
    return response?.data;
  } catch (error) {
    throw error;
  }
};
