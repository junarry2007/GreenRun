import { EnviromentConfiguration } from "../utils/enviroment";

export const FirebaseAdmin_ServiceAccountId: string = EnviromentConfiguration.dev.serviceAccountId;

export const FirebaseClient_Config: any = {
    apiKey: EnviromentConfiguration.dev.apiKey,
    authDomain: EnviromentConfiguration.dev.authDomain,
    projectId: EnviromentConfiguration.dev.projectId,
    storageBucket: EnviromentConfiguration.dev.storageBucket,
    messagingSenderId: EnviromentConfiguration.dev.messagingSenderId,
    appId: EnviromentConfiguration.dev.appId,
    measurementId: EnviromentConfiguration.dev.measurementId
}