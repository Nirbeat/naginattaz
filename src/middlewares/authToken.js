import { createToken } from "../config/jwt.js";
import passport from "passport";

export const authToken = (req, res, next) => {

    try {
        
        const {user} = req;
        if (user) {
            const token = createToken(user);
            res.cookie('jwt', token, {httpOnly: true, secure: true})
            next();
        }else{
            user = null
            next()
        }
    } catch (error) {
        next(error)
    }
}

export const customVerification = (req, res, next) => {
    try {
        
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) return next(err);
    
            if (user) {
                req.user = user;
            } else req.user = null
    
            next();
        })(req, res, next);
    } catch (error) {
        next(error)
    }
};

export const ensureAuthenticated = (req, res, next) => {
    try {
        
        if (req.user) {
            return next();
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        next(error)
    }
};