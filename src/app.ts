import express, { Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { errorMiddleware } from './middlewares/error.middleware';
import AuthenticationFilter from './middlewares/auth.middleware';
import authRoute from "./routes/auth.route";
import { getLocalIPAddres } from "./utils/security.utils.ts";
import realtorRoute from "./routes/realtor.route.ts";
import { config } from './config/config.ts';

const version1 = 1;
export const api_prefix_v1 = `/api/v${version1}`;
const IP_ADDR = getLocalIPAddres();

const app = express();

app.use(express.json());
app.use(errorMiddleware);

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API v1',
      version: '1.0.0',
      description: 'API v1 documentation with JWT authentication',
    },
    servers: [
      {
        url: `http${config.ENV === "test" ? "s" : ""}://${IP_ADDR}:3000${api_prefix_v1}`,
        description: "Development server (HTTP) for v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.ts')], // Adjust path as needed
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(`${api_prefix_v1}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(api_prefix_v1, realtorRoute);

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send(`<h1>Welcome to my Backend</h1>`);
});



const filter = new AuthenticationFilter();

// Use auth routes
app.use(api_prefix_v1, authRoute);

export default app;