import { ObjectId } from "mongodb";

export interface Cache {
  _id?: ObjectId;
  key: string;
  value: any;
}
