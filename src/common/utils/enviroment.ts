export const EnviromentConfiguration = { 
    dev: {
        //-- DBConfig
        host: 'rds-green-run-db.ckp4ralggjmo.us-east-2.rds.amazonaws.com',
        port: 3306,
        username: 'admin',
        password: 'Fjmora.*.030293',
        database: 'green_run_db',
        
        // //-- Firebase ClientConfig
        apiKey: 'AIzaSyAL5YjlksUu33rN0h_nqmlW73KyQkHkbj0',
        authDomain: 'green-run-app.firebaseapp.com',
        projectId: 'green-run-app',
        storageBucket: 'green-run-app.appspot.com',
        messagingSenderId: '215508846808',
        appId: '1:215508846808:web:45c5bcc5cbb7fae0e52fad',      
        measurementId: 'G-NXY6PMYSV2',
        
        //-- Firebase AdminConfig
        serviceAccountId: 'my-client-id@my-project-id.iam.gserviceaccount.com'
    },
    prod: {
        //-- DBConfig
        host: 'rds-green-run-db.ckp4ralggjmo.us-east-2.rds.amazonaws.com',
        port: 3306,
        username: 'admin',
        password: 'Fjmora.*.030293',
        database: 'green_run_db',
        
        //-- Firebase ClientConfig
        apiKey: 'AIzaSyAL5YjlksUu33rN0h_nqmlW73KyQkHkbj0',
        authDomain: 'green-run-app.firebaseapp.com',
        projectId: 'green-run-app',
        storageBucket: 'green-run-app.appspot.com',
        messagingSenderId: '215508846808',
        appId: '1:215508846808:web:45c5bcc5cbb7fae0e52fad',      
        measurementId: 'G-NXY6PMYSV2',

        //-- Firebase AdminConfig
        serviceAccountId: 'my-client-id@my-project-id.iam.gserviceaccount.com'
    }
}