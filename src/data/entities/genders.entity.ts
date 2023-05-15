import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { StateEnum } from "../../common/utils/state.enum";
import { UserEntity } from "./user.entity";

@Entity({ name: 'genders' })
export class GenderEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column({
        type: 'enum',
        enum: StateEnum
    })
    state!: StateEnum;

    @OneToMany(_ => UserEntity, user => user.gender)
    genderUser?: UserEntity[];
}