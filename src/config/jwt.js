import jwt from "jsonwebtoken";
import { environment } from "./env.js";

export function createToken(userData){

    return jwt.sign(userData, environment.JWTSecret, {expiresIn: 60*60*24}); //un dia
}

export function extractJWTFromCookies(req){
    if(req && req.cookies) return req.cookies.jwt
}