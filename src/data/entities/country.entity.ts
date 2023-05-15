import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { StateEnum } from "../../common/utils/state.enum";
import { UserEntity } from "./user.entity";

@Entity({ name: 'countries' })
export class CountryEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column()
    code!: string;

    @Column({
        type: 'enum',
        enum: StateEnum
    })
    state!: StateEnum;

    
    @OneToMany(_ => UserEntity, user => user.country)
    countryUser?: UserEntity[];
}