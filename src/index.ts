import app, {api_prefix_v1} from './app';  // Importer l'application configurée
import 'dotenv/config';
import mongoose, { connect, ConnectOptions } from 'mongoose';
import { config } from "./config/config";
import { logger } from './utils/logger';
import https from 'https';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { InferenceSession } from 'onnxruntime-web';

const IP_ADDR = getLocalIPAddress();
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
    logger.info(`CONNECTING TO ${CLUSTER_URL_TEST}`);
  } else {

    connectOptions = {
      dbName: DB_NAME,
      serverApi: { version: "1", deprecationErrors: true, strict: true }
    };
    await connect(CLUSTER_URL, connectOptions);
    logger.info(`CONNECTING TO ${CLUSTER_URL}`);
  }

  // await seed(); // Run this to seed the database
}


run().catch(err => logger.error(err));

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
    console.log(`API docs are running on: https://${IP_ADDR}:3000${api_prefix_v1}/docs`)
  });

}

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