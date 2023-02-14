require('dotenv').config();

import { httpServer } from "./app/context";
import { sequelize } from "./app/context/database";
import logger from './logger';

import "./app/enterprise";

async function runServers() {
  await Promise.all([
    // sequelize.sync(),
    new Promise<void>((res) => httpServer.listen(process.env.SERVER_PORT || 8080, res))
  ]);

  logger.info(`Server started: http${process.env.SSL_MODE === 'off' ? '' : 's'}://localhost:${process.env.SERVER_PORT || 8080}`);  
}

runServers();
