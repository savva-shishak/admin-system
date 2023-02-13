import { ARRAY, BOOLEAN, INTEGER, Model, NUMBER, STRING, TEXT } from "sequelize";
import { sequelize } from "../../context/database";

export type TPhone = Omit<Phone, keyof Model>;

export class Phone extends Model<any, any> {
  public declare id: number;
  public declare name: string;
  public declare model: string;
  public declare price: number;
  public declare count: number;
  public declare image: string;
  public declare published: boolean;
  public declare equipment: string[];
  public declare shopId: number;
}

Phone.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: TEXT,
      allowNull: false,
    },
    model: {
      type: TEXT,
      allowNull: false,
    },
    price: {
      type: INTEGER,
      allowNull: false,
    },
    count: {
      type: INTEGER,
      allowNull: false,
    },
    image: {
      type: TEXT,
      allowNull: false,
    },
    published: {
      type: BOOLEAN,
      allowNull: false,
    },
    equipment: {
      type: ARRAY(STRING),
      allowNull: false,
    },
    shopId: {
      type: NUMBER,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'phone-3'
  }
);