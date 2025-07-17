import mysql from 'mysql2/promise.js';
import { environment } from '../config/env.js';


export async function DBConnection(){
    return await mysql.createConnection({
    host: environment.database.host,
    database: environment.database.name,
    password: environment.database.password,
    user: environment.database.user
});}