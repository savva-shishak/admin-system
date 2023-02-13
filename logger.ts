import { createLogger, format, transports } from 'winston';
import path from 'path';
import DailyRotateLog from 'winston-daily-rotate-file';
import { logPath, logLevel } from './app/context/logger';

const getDetailsFromFile = (fileDetails: any) => {
  const fileAndRow = fileDetails
      .split('at ').pop()
      .split('(').pop()
      .replace(')', '')
      .split(':');

  const detailsFromFile = {
    file: fileAndRow[0].trim(),
    line: fileAndRow[1],
    row: fileAndRow[2],
  } as any;

  detailsFromFile.formattedInfos = Object.keys(detailsFromFile)
      .reduce((previous, key) => previous + detailsFromFile[key]);

  return detailsFromFile;
};

const {
  combine, timestamp: tsFormat, printf, colorize,
} = format;

const transportOptions = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
};

const logFormat = printf(({
  level, message, timestamp,
}) => `[${level}] ${timestamp}: ${message}`);

const errorLog = path.join(path.resolve(logPath), 'error-%DATE%.log');
const accessLog = path.join(path.resolve(logPath), 'access-%DATE%.log');

const loggerOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5,
  },
  level: logLevel,
  transports: [
    new transports.Console({
      // @ts-ignore
      formatter: (options) => {
        const detailsFromFile = getDetailsFromFile(new Error().stack);

        // S'il y a un objet, on le formatte
        const meta = (options.meta && Object.keys(options.meta).length)
            ? JSON.stringify(options.meta, null, 2)
            : '';
        return `${options.timestamp()}\t`
            + `${options.message}`
            + `${meta}`
            + `${detailsFromFile.formattedInfos}`;
      },
    }),
    new DailyRotateLog({ filename: path.resolve(errorLog), level: 'error', ...transportOptions }),
    new DailyRotateLog({ filename: path.resolve(accessLog), level: 'info', ...transportOptions }),
  ],
  format: combine(
      colorize(),
      tsFormat({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      logFormat,
  ),
  meta: false,
  colorize: true,
};

export default createLogger(loggerOptions);
