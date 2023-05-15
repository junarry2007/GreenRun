import { TransactionEntity } from "../../data/entities/transaction.entity";

export interface TransactionsBalanceDto {
    balance: number;
    transactions: TransactionEntity[];
}