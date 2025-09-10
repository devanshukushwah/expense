import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import api from "@/lib/axios";

export const getCategories = async () => {
  try {
    const response = await api.get(HttpUrlConfig.getCategoriesUrl());
    return response?.data;
  } catch (error) {
    throw error;
  }
};
