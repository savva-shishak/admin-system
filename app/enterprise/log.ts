import { DATE, INTEGER, Model, STRING, TEXT } from "sequelize";
import { sequelize } from "../context/database";

export class Log extends Model {
  declare id: number;

  declare peerId: string;
  declare displayName: string;

  declare datetime: Date;

  declare type: 'info' | 'error' | 'warning' | 'success';

  declare browser: string;

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
    browser: {
      type: STRING,
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
  },
);