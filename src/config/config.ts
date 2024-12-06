import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  ENV: process.env.NODE_ENV,
  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_SECRET: process.env.JWT_SECRET ?? "42",
  CERT_KEY: process.env.CERT_KEY_PATH,
  CERT_CERT: process.env.CERT_CERT_PATH,
  CLUSTER_URL : process.env.CLUSTER_URI,
  CLUSTER_URL_TEST: process.env.DB_URI_TEST,
  TEST_DB_NAME: process.env.TEST_DB_NAME,
  DB_NAME: process.env.DB_NAME,
  MODEL_NAME: process.env.MODEL_NAME,
  ATTOM_API_KEY: process.env.ATTOM_API_KEY,
  KAGGLE_USERNAME: process.env.KAGGLE_USERNAME || "raaphe",
  KAGGLE_KEY: process.env.KAGGLE_KEY || "b0a7e8b0023236b5e5af4a3190fe8d3b",
  DATASET_PATH: process.env.DATASET_PATH || "src/data/datasets/realtor-data.zip.csv",
};