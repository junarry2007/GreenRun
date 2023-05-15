import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { StateEnum } from "../../common/utils/state.enum";
import { UserEntity } from "./user.entity";

@Entity({ name: 'users_state' })
export class UserStateEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column({
        type: 'enum',
        enum: StateEnum
    })
    state!: StateEnum;

    @OneToMany(_ => UserEntity, user => user.userState)
    userStateUser?: UserEntity[];
}