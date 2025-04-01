import { Router } from "express"
import passport from "passport";

const router = Router();

router.use(passport.authenticate('jwt', {session: false}));

router.get('/logout', async (req, res) => {
    res.cookie('jwt', '').redirect('/');
})
export default router;