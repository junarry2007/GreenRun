import { AuthenticationController } from "../controllers/authentication.controller";
import { TransactionController } from "../controllers/transaction.controller";
import { UserController } from "../controllers/user.controller";
import { Server } from "@hapi/hapi";

export class UserRoutes {

    private _server: Server;
    private _userController: UserController;
    private _authenticationController: AuthenticationController;
    private _transactionsController: TransactionController;

    constructor(server: Server){
        this._server = server;
        this._userController = new UserController();
        this._authenticationController = new AuthenticationController();
        this._transactionsController = new TransactionController();
    }

    Initialize(): void {
        this._server.route({
            method: 'POST',
            path: '/user/signin',
            options: {
                handler: this._authenticationController.signin
            }
        });

        this._server.route({
            method: 'POST',
            path: '/user/signup',
            options: {
                handler: this._userController.createUser
            }
        });

        this._server.route({
            method: 'GET',
            path: '/user/bets/{id}',
            options: {
                auth: 'use-bearer-token',
                handler: this._userController.getBets
            }
        });

        this._server.route({
            method: 'POST',
            path: '/user/bets',
            options: {
                auth: 'use-bearer-token',
                handler: this._userController.addBet
            }
        });

        this._server.route({
            method: 'GET',
            path: '/user/transactions',
            options: {
                auth: 'use-bearer-token',
                handler: this._transactionsController.getUserTransactions
            }
        });
        
    }

}