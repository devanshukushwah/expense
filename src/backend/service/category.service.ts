import * as categoryRepo from "@/backend/repo/category.repo";

export const getCategories = async () => {
  const categories = await categoryRepo.getCategories();
  return categories;
};
