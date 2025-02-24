import jwt from "jsonwebtoken";
import { environment } from "./env.js";

export function createToken(userData){

    return jwt.sign(userData, environment.JWTSecret, {expiresIn: 60*60*24*3}); //tres dias
}

export function validateToken(token){
    return jwt.verify(token, environment.JWTSecret);
}

export function decodeToken(token){
    return jwt.decode(token, {json})
}