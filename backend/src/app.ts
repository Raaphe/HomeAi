import express, { Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { errorMiddleware } from './middlewares/error.middleware';
import AuthenticationFilter from './middlewares/auth.middleware';
import authRoute from './routes/auth.route';
import listingRoute from "./routes/listings.route.ts"
import { getLocalIPAddres } from './utils/security.util.ts';
import realtorRoute from './routes/realtor.route';
import cron from 'node-cron';
import { runDatasetUpdate } from './utils/update_dataset.util.ts';
import { SoldPropertyService } from './services/sold-property.service.ts';
import { config } from './config/config.ts';
import fileUtil from './utils/file.util.ts';
import soldPropertyRoute from "./routes/sold-property.route.ts";
import fs from "fs";
import cors from "cors";
const version1 = 1;
export const api_prefix_v1 = `/api/v${version1}`;
const IP_ADDR = getLocalIPAddres();

export const soldPropertyService = new SoldPropertyService();

async function updateAndWriteGraphFunctions(): Promise<void> {
  try {
    await runDatasetUpdate();

    await soldPropertyService.loadProperties(config.DATASET_PATH);
    await soldPropertyService.writeGraphFunctionsToFile('../data/graph-data.json');

    console.log('Graph functions have been written successfully.');
  } catch (err) {
    console.error('Error in the dataset update or graph function write:', err);
  }
}

cron.schedule('0 3 * * 6', async () => {
  await updateAndWriteGraphFunctions();
});

fileUtil.checkFileExists(config.DATASET_PATH)
    .then(async (doesFileExist) => {
      if (!doesFileExist) {
        await updateAndWriteGraphFunctions();
      }
    })
    .catch((err) => {
      console.error('Error checking if file exists:', err);
});

const app = express();

app.use(express.json());
app.use(errorMiddleware);
app.use(cors<Request>);

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
        url: `http${config.ENV === 'test' ? 's' : ''}://${IP_ADDR}:3000${api_prefix_v1}`,
        description: 'Development server (HTTP) for v1',
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
  apis: [path.join(__dirname, './routes/*.ts')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));

app.use(`${api_prefix_v1}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(api_prefix_v1, realtorRoute);
app.use(api_prefix_v1, listingRoute);
app.use(api_prefix_v1, soldPropertyRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Welcome to my Backend</h1>');
});

const filter = new AuthenticationFilter();

app.use(api_prefix_v1, authRoute);

export default app;