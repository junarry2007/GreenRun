import { Server } from "@hapi/hapi";
import { DocumentController } from "../controllers/document.controller";
import { SwaggerDefinition } from "../../common/utils/swagger.definition";

export class DocumentRoutes {

    private _server: Server;
    private _documentController: DocumentController;
    private _swaggerDefinition: SwaggerDefinition;

    constructor(server: Server){
        this._server = server;
        this._documentController = new DocumentController();
        this._swaggerDefinition = new SwaggerDefinition();
    }

    Initialize(): void {
        this._server.route({
            method: 'GET',
            path: '/document',
            options: {
                handler: this._documentController.getAll,
                plugins: this._swaggerDefinition.getAllDocumentsResponse(),
                tags: ['api']
            }
        });

        this._server.route({
            method: 'GET',
            path: '/document/{id}',
            handler: this._documentController.getById
        });
    }

}