import { INTEGER, Model, STRING } from "sequelize";
import { sequelize } from "../../context/database";

export class Point extends Model<any, any> {
  public declare id: number;
  public declare name: string; 
}

Point.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'points-2',
  }
)