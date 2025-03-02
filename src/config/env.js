import { config } from "dotenv";

config();

export const environment = {
    serverPort : process.env.PORT || 8080,
    database:{
        host : process.env.host || 'localhost',
        name: process.env.DB_NAME || 'naginattaz',
        password: process.env.DB_PASS || '',
        user: process.env.DB_USER || 'root'
    },
    googleAuth:{
        clientID: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_SECRET
    },
    JWTSecret: process.env.JWT_SECRET,
    mercadopago: {
        token: process.env.MERCADOPAGO_TOKEN
    }
}