import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { StateEnum } from "../../common/utils/state.enum";

@Entity({ name: 'roles' })
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column({
        type: 'enum',
        enum: StateEnum
    })
    state!: StateEnum;
}