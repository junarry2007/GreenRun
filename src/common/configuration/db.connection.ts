import { EnviromentConfiguration } from "../utils/enviroment";

export const DbConnection: any = {
    host: EnviromentConfiguration.dev.host,
    port: EnviromentConfiguration.dev.port,
    username: EnviromentConfiguration.dev.username,
    password: EnviromentConfiguration.dev.password,
    database: EnviromentConfiguration.dev.database
}