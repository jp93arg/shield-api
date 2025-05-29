import sequelize from "../config/db";

beforeAll(async () => {
  await sequelize.sync({ force: true }); // re-creates tables
});

afterAll(async () => {
  await sequelize.close();
});
