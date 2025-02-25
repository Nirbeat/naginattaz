import { createToken } from "../config/jwt.js";
import passport from "passport";
export const authToken = (req, res, next) => {
    const {user} = req;
    if (user) {
        const token = createToken(user);
        res.cookie('jwt', token, {httpOnly: true, secure: true})
        next();
    }else{
        user = null
        next()
    }
}

export const customVerification = (req, res, next) =>{

    passport.authenticate('jwt', {session : false}, (err, user, info) => {
        if(err || !user) req.user = null;
        else req.user = user
    })
    next()
}