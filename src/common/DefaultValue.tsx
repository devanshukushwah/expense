import { Spend } from "@/collection/Spend.collection";

export const spendDefaultValue = (): Spend => ({
  desc: "",
  amt: "",
  catId: "",
});
