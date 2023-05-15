import { AppDataSource } from "../data.source";
import { TransactionTypeEntity } from "../entities/transaction.type.entity";

export class TransactionTypeRepository {

    static getById(id: number): Promise<TransactionTypeEntity | null>{
        return AppDataSource.getRepository(TransactionTypeEntity).findOneBy({
            id: id
        });
    }

}