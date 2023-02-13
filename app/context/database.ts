import { Subject } from "rxjs";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DBNAME || '', process.env.DBUSER || '', process.env.DBPASSWORD || '', {
  dialect: "postgres",
  host: process.env.DBSERVER,
});

export const onConnectDatabase = new Subject();
