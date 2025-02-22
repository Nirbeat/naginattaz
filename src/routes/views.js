import { Router } from "express";

const router = Router();

router.get('/', async (req, res)=>{

    res.render('index.handlebars', {
        style : '/styles/naginattaz.min.css',
        indexStyle: '/styles/index.css',
        images:{
            cart: '/images/cart.png',
            mainLogo: '/images/main-logo.png',
            banners:{
                mobile: {first: '/images/banners/BANNERPRINCIPAL_1_mob.png', second: '/images/banners/BANNERPRINCIPAL_2_mob.png'},
                web: {first: '/images/banners/BANNERPRINCIPAL_1.png',second: '/images/banners/BANNERPRINCIPAL_2.png'}
            }
        }
    });
});

export default router;