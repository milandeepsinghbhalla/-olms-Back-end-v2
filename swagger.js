const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Open Logistics API',
        description: 'Description'
    },
    host: 'localhost:7777'
};

const outputFile = './swagger.json';
const routes = ['./Routes/userRoutes.js'];

swaggerAutogen(outputFile, routes, doc);