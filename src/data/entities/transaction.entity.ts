import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { TransactionTypeEntity } from "./transaction.type.entity";

@Entity({ name: 'transactions' })
export class TransactionEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(_ => UserEntity, user => user.userTransaction)
    @JoinColumn({
        name: 'user_id'
    })
    user!: UserEntity;

    @ManyToOne(_ => TransactionTypeEntity, transactionType => transactionType.transactionTypeTransaction)
    @JoinColumn({
        name: 'transaction_type_id'
    })
    transactionType!: TransactionTypeEntity;

    @Column()
    amount!: number;

    @Column({ name: 'old_balance' })
    oldBalance!: number;

    @Column({ name: 'new_balance' })
    newBalance!: number;

    @Column({ name: 'created_at' })
    createdAt!: Date;

    @Column({ name: 'updated_at' })
    updatedAt?: Date;

    @Column({ name: 'bet_id' })
    betId?: number;
}