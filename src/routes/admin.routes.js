import { Router } from "express";
import { customVerification, ensureAdmin, ensureAuthenticated } from "../middlewares/authToken.js";
import { CoursesDAO } from "../database/DAO/CoursesDAO.js";
import { viewsRoutesErrorHandler } from "../middlewares/routes.js";
import { UsersDAO } from "../database/DAO/UsersDAO.js";

const router = Router();
router.use(customVerification)
router.use(ensureAuthenticated)
router.use(ensureAdmin);

router.get('/class-views', async (req, res, next) => {
    const date = new Date();
    try {
        const { user } = req;
        let { month, year } = req.query;

        if (!month) month = date.getMonth() + 1
        if (!year) year = date.getFullYear();
        
        const classesData = await new CoursesDAO().getClassViewsByPeriod(month, year);
        res.render('class-views.handlebars', {
            style: '/styles/main.css',
            profileStyle: '/styles/profile.css',
            classesData,
            date: {
                month: parseInt(month),
                year: parseInt(year)
            },
            userData: {
                name: user.name,
                profileImg: user.profile_image,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error)
        next();
    }
});

router.get('/users/subs', async (req, res, next) => {
    try {
        const {user} = req;
        const [users] = await new UsersDAO().getPremiumUsers();
        res.render('users-subs.handlebars',{
            style: '/styles/main.css',
            profileStyle: '/styles/profile.css',
            users,
             userData: {
                name: user.name,
                profileImg: user.profile_image,
                role: user.role
            }

        });
    } catch (error) {
        next();
    }

});

router.use(viewsRoutesErrorHandler);
export default router;