import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db";
import User from "./user"; // import the User model

class Wallet extends Model {
  public id!: number;
  public userId!: number;
  public tag?: string;
  public chain!: string;
  public address!: string;
}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    chain: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: "Wallets",
    sequelize
  }
);

// Define association
Wallet.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Wallet, { foreignKey: "userId", as: "wallets" });

export default Wallet;
