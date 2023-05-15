import { InitServer } from './common/app';
import { AppDataSource } from './data/data.source';

InitServer();

AppDataSource.initialize()
    .then(() => {
        console.log('=> JMORA_LOG: Server Start');
    })
    .catch((error) => console.log(error))