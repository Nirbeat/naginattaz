import { config } from "dotenv";

config();

export const environment = {
    serverPort : process.env.PORT || 3000,
    database:{
        host : process.env.host,
        name: process.env.DB_NAME,
        password: process.env.DB_PASS,
        user: process.env.DB_USER
    },
    cookieParser: process.env.COOKIE_PARSER_SECRET,
    googleAuth:{
        clientID: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_SECRET,
        redirectURL: process.env.GOOGLE_REDIRECT_URL
    },
    JWTSecret: process.env.JWT_SECRET,
    mercadopago: {
        token: process.env.MERCADOPAGO_TOKEN,
        publicKey: process.env.MERCADOPAGO_KEY
    },
    mailing:{
        nagimail: process.env.NAGIMAIL,
        nagipass: process.env.NAGIPASS
    }
}