import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const options = {
    definition: {
        openapi:'3.0.0',
        info:{
            title: 'Social Media API', 
            version: '1.0.0',
            description: 'Api docs for social media app',
        },
        servers:[
            {
                url: 'http://localhost:5000',
            }
        ],
        components:{
            securitySchemes: {
                bearerAuth:{
                    type:'http',
                    scheme: 'bearer',
                    bearerFormat:'JWT',
                },
            },
        },
        security:[
            {
                bearerAuth:[],
            },
        ],
    },
    apis:['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSpec;

