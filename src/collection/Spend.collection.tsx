import { ObjectId } from "mongodb";

export interface Spend {
  _id?: ObjectId;
  desc: string | undefined;
  amt: number | null;
  catId: number | null;
  cat?: string;
  createdBy?: ObjectId;
  createdAt?: Date;
}
