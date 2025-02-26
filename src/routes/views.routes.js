import { Router } from "express";
import { UserDao } from "../database/DAO/UserDAO.js";
import passport from 'passport';
import { customVerification, ensureAuthenticated } from "../middlewares/authToken.js";

const router = Router();

router.get('/login', async (req, res) => {

    res.render('login.handlebars',{
        style: '/styles/naginattaz.min.css',
        loginStyles: '/styles/login.css'
    });
});

router.use(customVerification);

router.get('/', async (req, res) => {

    res.render('index.handlebars', {
        style: '/styles/naginattaz.min.css',
        indexStyle: '/styles/index.css',
        images: {
            cart: '/images/cart.png',
            mainLogo: '/images/main-logo.png',
            banners: {
                mobile: { first: '/images/banners/BANNERPRINCIPAL_1_mob.png', second: '/images/banners/BANNERPRINCIPAL_2_mob.png' },
                web: { first: '/images/banners/BANNERPRINCIPAL_1.png', second: '/images/banners/BANNERPRINCIPAL_2.png' }
            }
        },
        user: req.user
    });
});

router.get('/terms', async (req, res) => {

    res.render('condition-terms.handlebars',{
        style: '/styles/naginattaz.min.css',
        legalStyle: '/styles/legals.css'
    });
});

router.get('/policies', async(req, res) => {
    res.render('policy.handlebars',{
        style: '/styles/naginattaz.min.css',
        legalStyle: '/styles/legals.css'
    });
});

router.get('/team', async (req, res) => {

    let [teamMembers] = await new UserDao().getTeamMembers();

    // PASAR LUEGO A UN DTO
    teamMembers = teamMembers.map(({name, skills, instagramURL, tiktokURL, profile_image})=>{
        return {
            name, skills, instagramURL, tiktokURL, profile_image
        }
    })
    res.render('TEAM.handlebars', {
        style: '/styles/naginattaz.min.css',
        teamMembers,
        teamStyles: '/styles/team.css'
    });
});

router.use(ensureAuthenticated)

router.get('/clases', async (req, res) => {
})
export default router;