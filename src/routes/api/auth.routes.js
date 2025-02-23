import { Router } from "express";
import passport from "passport";
const router = Router()


router.get('/google',
    passport.authenticate('google',
        {scope:[
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile']}),
    async (req, res) => {

});

router.get('/google-authentication',
    passport.authenticate('google',
        {failureRedirect:'/login', session:false}),
    async(req, res) => {
        res.redirect('/')
});

export default router;