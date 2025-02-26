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

export const customVerification = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err);

        if (user) {
            req.user = user;
        } else req.user = null

        next();
    })(req, res, next);
};

export const ensureAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        return res.redirect('/login');
    }
};