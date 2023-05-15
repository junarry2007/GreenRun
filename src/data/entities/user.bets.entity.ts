import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserBetsStateEnum } from "../../common/utils/state.enum";

@Entity({ name: 'user_bets' })
export class userBetsEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: 'user_id'})
    userId!: number;

    @Column({name: 'bet_id'})
    betId!: number;

    @Column({name: 'created_at'})
    createdAt!: Date;

    @Column()
    amount!: number;

    @Column({
        type: 'enum',
        enum: UserBetsStateEnum
    })
    state!: UserBetsStateEnum

    @Column({name: 'updated_at'})
    updatedAt?: Date;
}