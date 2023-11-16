require('dotenv').config();
import config from 'config';

import { createApp } from './app';
import validateEnv from './utils/validate_env';

validateEnv();

const port = config.get<number>('port');

createApp(port);
