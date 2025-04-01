import { Router } from "express";
import passport from "passport";
import { authToken } from "../../middlewares/authToken.js";
const router = Router()


router.get('/google',
    passport.authenticate('google',
        {scope:[
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile']}),
    async (req, res, next) => {
        try {
            
        } catch (error) {
            next(error)
        }
});

router.get('/google-authentication',
    passport.authenticate('google',
        {failureRedirect:'/login', session:false}),
    authToken,
    async(req, res, next) => {
        try {
            res.redirect('/')
            
        } catch (error) {
            next(error)
        }
});

export default router;