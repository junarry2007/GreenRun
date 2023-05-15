import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BetStateEnum } from "../../common/utils/state.enum";

@Entity({ name: 'bets' })
export class BetsEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column()
    odd!: number;

    @Column({name:'event_id'})
    eventId!: number;

    @Column({
        name: 'bet_state',
        type: 'enum',
        enum: BetStateEnum
    })
    state!: BetStateEnum;

    @Column({name:'created_at'})
    createdAt!: Date;

    @Column({name:'update_at'})
    updateAt?: Date;
}