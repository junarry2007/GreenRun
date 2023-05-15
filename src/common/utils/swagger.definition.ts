export class SwaggerDefinition {
    getAllDocumentsResponse(): any{
        return {
            'hapi-swagger': {
                responses: {
                    200:{
                        description: 'Listado de documentos',
                        schema: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        description: 'Id del rergistro',
                                        example: 1
                                    },
                                    description: {
                                        type: 'string',
                                        description: 'Descripción del tipo de documento',
                                        example: 'Documento de prueba'
                                    },
                                    acronym: {
                                        type: 'string',
                                        description: 'Acrónimo',
                                        example: 'DP'
                                    },
                                    state: {
                                        type: 'integer',
                                        description: 'Estado del registro: 1 - Activo, 0 - Inactivo',
                                        example: 1
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error: 0x0002 - [error-exception]'
                    }
                },
                payloadType: 'json'
            }
        }
    }
}