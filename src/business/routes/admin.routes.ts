import { AdminController } from "../controllers/admin.controller";
import { AuthenticationController } from "../controllers/authentication.controller";
import { TransactionController } from "../controllers/transaction.controller";
import { UserController } from "../controllers/user.controller";
import { Server } from "@hapi/hapi";

export class AdminRoutes {

    private _server: Server;
    private _adminController: AdminController;

    constructor(server: Server){
        this._server = server;
        this._adminController = new AdminController();
    }

    Initialize(): void {
        
        this._server.route({
            method: 'GET',
            path: '/admin/bets/eventId={eventId?}&sportId={sportId?}',
            options: {
                auth: 'use-bearer-token',
                handler: this._adminController.getBetsByEventIdOrSportId
            }
        });

        this._server.route({
            method: 'POST',
            path: '/admin/bets/update-state',
            options: {
                auth: 'use-bearer-token',
                handler: this._adminController.updateBetState
            }
        });

    }

}