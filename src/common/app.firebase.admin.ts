import { FirebaseAdmin_ServiceAccountId } from './configuration/firebase.config';
import { initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import account_config = require("./account_config.json");

export class AppFirebaseAdmin {
    constructor(){
        const firebaseAdminConfig = require("./account_config.json");
        initializeApp({
            credential: credential.cert(firebaseAdminConfig),
            serviceAccountId: FirebaseAdmin_ServiceAccountId
        });
    }
}