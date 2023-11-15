import config from 'config';
import { Sequelize } from 'sequelize-typescript';

const databaseURL = config.get<string>('dbURL');

const sequelize = new Sequelize(databaseURL, {
  dialect: 'mysql',
  models: [__dirname + '/models'],
  logging: false,
});

export default sequelize;
