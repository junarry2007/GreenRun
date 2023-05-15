import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { TransactionEntity } from "./transaction.entity";
import { GenderEntity } from "./genders.entity";
import { CountryEntity } from "./country.entity";
import { UserStateEntity } from "./user.state.entity";

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'firebase_uid' })
    firebaseId!: string;

    @ManyToOne(_ => GenderEntity, gender => gender.genderUser)
    @JoinColumn({
        name: 'gender_id'
    })
    gender!: GenderEntity

    @ManyToOne(_ => CountryEntity, country => country.countryUser)
    @JoinColumn({
        name: 'country_id'
    })
    country!: CountryEntity

    @ManyToOne(_ => UserStateEntity, userState => userState.userStateUser)
    @JoinColumn({
        name: 'user_state_id'
    })
    userState!: UserStateEntity

    @OneToMany(_ => TransactionEntity, userTransaction => userTransaction.user)
    userTransaction?: TransactionEntity[];

    @Column({ name: 'first_name' })
    firstName!: string;

    @Column({ name: 'second_name' })
    secondName?: string;

    @Column({ name: 'first_surname' })
    firstSurname!: string;

    @Column({ name: 'second_surname' })
    secondSurname?: string;

    @Column()
    phone!: string;

    @Column()
    email!: string;

    @Column({ name: 'user_name' })
    userName!: string;

    @Column()
    address!: string;

    @Column({ name: 'birth_date' })
    birthDate!: Date;

    @Column()
    city!: string;

    @Column({ name: 'created_at' })
    createdAt!: Date;

    @Column({ name: 'updated_at' })
    updatedAt?: Date;

    @Column({ name: 'deleted_at' })
    deletedAt?: Date;

    @Column()
    balance!: number;
}