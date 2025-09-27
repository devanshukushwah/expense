import * as categoryService from "@/backend/service/category.service";
import SerializeUtil from "@/utils/SerializeUtil";
import Home from "../pages/Home";

export default async function Page() {
  // Fetch categories from the database
  const categories = await categoryService.getCategories();

  // Serialize categories to ensure they are JSON-safe
  const serializeCategories = SerializeUtil.serializeDocs(categories);

  return <Home categories={serializeCategories} />;
}
