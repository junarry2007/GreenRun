import { Server } from '@hapi/hapi';

import { UserRoutes } from '../business/routes/user.routes';
import { DocumentRoutes } from '../business/routes/document.routes';

import * as Hapi from '@hapi/hapi';
import * as HapiSwagger from 'hapi-swagger';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import { AppFirebaseAdmin } from './app.firebase.admin';
import { AppFirebaseClient } from './app.firebase.client';
import { TransactionRoutes } from '../business/routes/transaction.routes';
import { AuthBearer } from '../business/security/auth.bearer';
import { AdminRoutes } from '../business/routes/admin.routes';

export const InitServer = async () => {

    const server: Server = new Server({
        port: 3000,
        host: 'localhost'
    });

    //#region Swwagger Config

    const swaggerOptions: HapiSwagger.RegisterOptions = {
        info: {
            title: 'Green Run API',
            version: '1.0.0',
            contact: {
                name: 'Julian Mora',
                email: 'faiberjulianmora@gmail.com'
            },
            description: 'API de prueba con Hapi JS'
        }
    };
    
    const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [{
        plugin: Inert
    },{
        plugin: Vision
    },{
        plugin: HapiSwagger,
        options: swaggerOptions
    }];

    await server.register(plugins);

    //#endregion

    //#region Firebase Config

    new AppFirebaseAdmin();

    new AppFirebaseClient();

    //#endregion

    //#region AuthBearer Config

    const hapiAuthBearerToken = require('hapi-auth-bearer-token');
    await server.register(hapiAuthBearerToken);
    server.auth.strategy('use-bearer-token', 'bearer-access-token', {
        allowQueryToken: true,
        validate: async (_request: any, token: any, _h: any) => {
            const authBearer = new AuthBearer();
            return authBearer.virify(token);
        }
    });

    //#endregion
    
    //#region Routes Config

    new DocumentRoutes(server).Initialize();

    new UserRoutes(server).Initialize();

    new TransactionRoutes(server).Initialize();

    new AdminRoutes(server).Initialize();

    //#endregion

    await server.start();

}