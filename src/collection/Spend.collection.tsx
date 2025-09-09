export interface Spend {
  _id?: string;
  desc: string | undefined;
  amt: number | null;
  catId: number | null;
  createdBy?: string;
  createdAt?: Date;
}
