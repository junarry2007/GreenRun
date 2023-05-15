import { DataSource } from "typeorm";
import { DocumentEntity } from "./entities/document.entity";
import { CountryEntity } from "./entities/country.entity";
import { GenderEntity } from "./entities/genders.entity";
import { RoleEntity } from "./entities/role.entity";
import { TransactionEntity } from "./entities/transaction.entity";
import { TransactionTypeEntity } from "./entities/transaction.type.entity";
import { UserEntity } from "./entities/user.entity";
import { UserStateEntity } from "./entities/user.state.entity";
import { DbConnection } from "../common/configuration/db.connection";
import "reflect-metadata";
import { BetsEntity } from "./entities/bets.entity";
import { userBetsEntity } from "./entities/user.bets.entity";

const _entities = [
    DocumentEntity,
    CountryEntity,
    GenderEntity,
    RoleEntity,
    TransactionEntity,
    TransactionTypeEntity,
    UserEntity,
    UserStateEntity,
    BetsEntity,
    userBetsEntity
];

export const AppDataSource = new DataSource({
    type: "mysql",
    host: DbConnection.host,
    port: DbConnection.port,
    username: DbConnection.username,
    password: DbConnection.password,
    database: DbConnection.database,
    synchronize: false,
    bigNumberStrings: true,
    supportBigNumbers: true,
    logging: true,
    entities: _entities
});