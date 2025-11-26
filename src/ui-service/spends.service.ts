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

export const getSpends = async (params) => {
  try {
    const response = await api.get(HttpUrlConfig.getSpendsUrl(), { params });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getSpend = async (spendId: string) => {
  try {
    const response = await api.get(HttpUrlConfig.getSpendUrl(spendId));
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const updateSpend = async (spendId: string, data) => {
  try {
    const response = await api.put(HttpUrlConfig.putSpendUrl(spendId), data);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSpend = async (spendId: string) => {
  try {
    const response = await api.delete(HttpUrlConfig.deleteSpendUrl(spendId));
    return response?.data;
  } catch (error) {
    throw error;
  }
};
