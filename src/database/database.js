import mysql from 'mysql2/promise.js';
import { environment } from '../config/env.js';

export const DBConnection = mysql.createPool({
  host: environment.database.host,
  database: environment.database.name,
  user: environment.database.user,
  password: environment.database.password,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});
