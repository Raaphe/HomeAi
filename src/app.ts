import express, { Request, Response } from 'express';
import os from 'node:os';
import path from 'path';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import AuthenticationFilter from './middlewares/auth.middleware';
import authRoute from "./routes/auth.route"
import { config } from './config/config';
import { logger } from './utils/logger';

// Step 1. Create an instance of AuthenticationFilter
const filter = new AuthenticationFilter();

const version1 = 1;

const app = express();

export const api_prefix_v1 = `/api/v${version1}`;

const router = express.Router();

// Step 2. Middleware for JSON parsing
app.use(express.json());

const IP_ADDR = getLocalIPAddress();

// Step 3. Define Swagger options for version 1
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
        url: `https://${IP_ADDR}:3000/${api_prefix_v1}`,
        description: "Development server (HTTPS) for v1"
      }
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
  apis: [path.resolve(__dirname, './routes/*.route.ts')]
};

app.use(`/api/docs`, swaggerUi.setup(swaggerOptions));

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to my Backend</h1>
  `);
});

app.use('/api/docs', router);



// Example use
// app.use(api_prefix_v2, productRoutesV2);
// app.use(api_prefix_v2, filter.authFilter, protectedProductsRouteV2);

// BOTH
app.use("/api", authRoute);

// Step 8. Error middleware for handling errors globally
app.use(errorMiddleware);

// Step 9. HTTPS server options
logger.info(config.CERT_CERT);

function getLocalIPAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName];
    for (const address of addresses ?? []) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return 'IP address not found';
}

export default app;
