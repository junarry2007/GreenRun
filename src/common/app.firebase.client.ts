import { initializeApp } from 'firebase/app';
import { FirebaseClient_Config } from './configuration/firebase.config';

export class AppFirebaseClient {
    constructor(){
        initializeApp(FirebaseClient_Config);
    }
}