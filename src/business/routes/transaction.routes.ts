import { Server } from "@hapi/hapi";
import { TransactionController } from "../controllers/transaction.controller";

export class TransactionRoutes {

    private _server: Server;
    private _transactionController: TransactionController;

    constructor(server: Server){
        this._server = server;
        this._transactionController = new TransactionController();
    }

    Initialize(): void {
        this._server.route({
            method: 'POST',
            path: '/transaction/deposit',
            options: {
                auth: 'use-bearer-token',
                handler: this._transactionController.add
            }
        });
    }
    
}