import { HttpUrlConfig } from "@/core/HttpUrlConfig";
const { default: api } = require("@/lib/axios");

export const getCategories = async () => {
  try {
    const response = await api.get(HttpUrlConfig.getCategoriesUrl());
    return response?.data;
  } catch (error) {
    throw error;
  }
};
