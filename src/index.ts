import app, { api_prefix_v1 } from './app';
import 'dotenv/config';
import mongoose, { connect, ConnectOptions } from 'mongoose';
import { config } from "./config/config";
import { loggerUtil } from './utils/logger.util.ts';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { getLocalIPAddres } from "./utils/security.util.ts";

const IP_ADDR = getLocalIPAddres();
const port = config.PORT || 3000;
const CLUSTER_URL = config.CLUSTER_URL || "";
const CLUSTER_URL_TEST = config.CLUSTER_URL_TEST || "";
const TEST_DB_NAME = config.TEST_DB_NAME;
const DB_NAME = config.DB_NAME;

const run = async () => {
  let connectOptions: ConnectOptions;

  if (config.ENV === "test") {
    connectOptions = {
      dbName: TEST_DB_NAME,
      serverApi: { version: "1", deprecationErrors: true, strict: true }
    };
    await connect(CLUSTER_URL_TEST, connectOptions);
    loggerUtil.info(`CONNECTING TO ${CLUSTER_URL_TEST}`);
  } else {
    connectOptions = {
      dbName: DB_NAME,
      serverApi: { version: "1", deprecationErrors: true, strict: true }
    };
    await connect(CLUSTER_URL, connectOptions);
    loggerUtil.info(`CONNECTING TO ${CLUSTER_URL}`);
  }
};

run().catch(err => loggerUtil.error('Error running server:', err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error to mongo db"));
db.once('open', () => {
  console.log('=== Connected to MongoDb Collection ===');
});

if (config.ENV === "production") {
  // Démarrer le serveur
  app.listen(port, () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
  });
} else {
  const httpsOptions: https.ServerOptions = {
    key: fs.readFileSync(path.resolve(config.CERT_KEY ?? "")),
    cert: fs.readFileSync(path.resolve(config.CERT_CERT ?? "")),
  };

  // Step 10. Create and start the HTTPS server
  https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`Server is running on https://${IP_ADDR}:${port}`);
    console.log(`API docs are running on: https://${IP_ADDR}:3000${api_prefix_v1}/docs`);
  });
}