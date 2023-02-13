import path from 'path';
import fs from 'fs/promises'
import logger from '../../logger';

const config = {
  logs: path.resolve(__dirname, '..', '..', process.env.LOGS_FOLRDER || 'assets/logs'),
  static: path.resolve(__dirname, '..', '..', process.env.STATIC_FOLRDER || 'assets/static'),
  staticUrl: '/static',

  recording: {
    outDir: path.resolve(__dirname, '..', '..', process.env.LOGS_FOLRDER || 'assets/static/records'),
    outUrl: '/static/records'
  },

  ssl: {
    crt: path.resolve(__dirname, '..', '..', process.env.SSL_CRT || 'assets/ssl/localhost.crt'),
    key: path.resolve(__dirname, '..', '..', process.env.SSL_KEY || 'assets/ssl/localhost.key')
  }
}

const createFolders = (paths: any) => {  
  for (const key in paths) {
    if (typeof paths[key] === 'object') {
      createFolders(paths[key]);
    } else {
      fs.mkdir(paths[key])
        .then(() => logger.info(paths[key] + ' was created'))
        .catch(() => {});
    }
  }
}

createFolders(config);

export default config;
