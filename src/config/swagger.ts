import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Shield Backend API",
    version: "1.0.0",
    description: "API documentation for managing users and wallets"
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"] // Where JSDoc comments live
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };
