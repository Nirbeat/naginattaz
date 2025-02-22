import { config } from "dotenv";

config();

export const environment = {
    serverPort : process.env.PORT || 8080,
    database:{
        host : process.env.host || 'localhost',
        name: process.env.DB_NAME || 'naginattaz',
        password: process.env.DB_PASS || '',
        user: process.env.DB_USER || 'root'
    }
}