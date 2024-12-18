import { Transaction } from "./TransactionTypes";

export interface Renew {
  id: string;
  transaction: Transaction;
  status: "request" | "approved" | "rejected";
}
