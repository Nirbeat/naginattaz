import { Router } from "express";

const router = Router();

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
        }
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

router.get('/login', async (req, res) => {
    res.render()
});
export default router;