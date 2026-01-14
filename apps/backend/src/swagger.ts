import path from "path";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Weep Protocol API',
            version: '1.0.0',
            description: 'AI-native micro-tipping backend with x402 + Thirdweb on Cronos',
        },
        components: {
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean'
                        },
                        data: {
                            type: 'object',
                            nullable: true
                        },
                        error: {
                            type: 'string',
                            nullable: true
                        },
                        message: {
                            type: 'string',
                            nullable: true
                        }
                    }
                }
            }
        }
    },
    apis: [
        path.resolve(__dirname, 'routes/*.ts'),
        path.resolve(__dirname, 'routes/*.js'),
    ]
};

const specs = swaggerJsDoc(options);

export {specs, swaggerUi};