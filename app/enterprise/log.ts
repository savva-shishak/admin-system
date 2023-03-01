import { DATE, INTEGER, Model, STRING, TEXT, JSONB } from "sequelize";
import { sequelize } from "../context/database";

export type UserAgentInfo = {
  isMobile: boolean,
  isDesktop: boolean,
  isBot: boolean,
  browser: string,
  version: string,
  os: string,
  platform: string,
  source: string,
}

export class Log extends Model {
  declare id: number;

  declare peerId: string;
  declare displayName: string;

  declare datetime: Date;

  declare type: 'info' | 'error' | 'warning' | 'success';

  declare userAgent: UserAgentInfo;

  declare text: string;

  declare roomId: string;
}

Log.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    peerId: {
      type: TEXT,
    },
    displayName: {
      type: TEXT,
    },
    type: {
      type: STRING,
    },
    userAgent: {
      type: JSONB,
    },
    text: {
      type: TEXT,
    },
    roomId: {
      type: TEXT,
    },
    datetime: {
      type: DATE,
    }
  },
  {
    sequelize,
    tableName: 'logs'
  },
);