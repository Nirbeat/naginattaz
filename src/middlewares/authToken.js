import { Router } from "express";
import { createToken } from "../config/jwt.js";

const middleware = Router();

export const authToken = (req, res, next) => {
    const {user} = req;
    if (user) {
        const token = createToken(user);
        res.cookie('jwt', token, {httpOnly: true, secure: true})
        next();
    }
}