import { Router } from "express";
import { UserDao } from "../database/DAO/UserDAO.js";
import { customVerification, ensureAuthenticated } from "../middlewares/authToken.js";
import { CoursesDAO } from "../database/DAO/CoursesDAO.js";

const router = Router();

router.get('/login', async (req, res) => {

    res.render('login.handlebars', {
        style: '/styles/naginattaz.min.css',
        loginStyles: '/styles/login.css'
    });
});

router.use(customVerification);

router.get('/', async (req, res) => {

    const {user} = req;
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
        user
    });
});

router.get('/terms', async (req, res) => {

    res.render('condition-terms.handlebars', {
        style: '/styles/naginattaz.min.css',
        legalStyle: '/styles/legals.css'
    });
});

router.get('/policies', async (req, res) => {
    res.render('policy.handlebars', {
        style: '/styles/naginattaz.min.css',
        legalStyle: '/styles/legals.css'
    });
});

router.get('/team', async (req, res) => {

    let [teamMembers] = await new UserDao().getTeamMembers();

    // PASAR LUEGO A UN DTO
    teamMembers = teamMembers.map(({ name, skills, instagramURL, tiktokURL, profile_image }) => {
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

router.get('/entrenamiento', async (req, res) => {

    const [courses] = await new CoursesDAO().getAllCourses();

    // console.log(courses)
    const { user } = req;
    res.render('training.handlebars', {
        style: '/styles/naginattaz.min.css',
        trainingStyle: '/styles/training.css',
        userData: {
            name: user.name,
            profileImg: user.profile_image
        },
        courses
    })
});

router.get('/clases/:courseID/:lessonID?', async (req, res) => {
    // console.log('Request received for courseID:', req.params.courseID);

    const {user}= req;
    let { courseID, lessonID } = req.params;
    const [lessons] = await new CoursesDAO().getCourseLessonsById(courseID);

    // console.log(lessons.find(lesson=> lesson.id== lessonID))
    if (!lessonID) {
        lessonID = lessons[0].id;
        res.status().redirect(`/clases/${courseID}/${lessonID}`)
    }
    else {
        res.render('lessons.handlebars', {
            style: '/styles/naginattaz.min.css',
            lessonsStyle: '/styles/lessons.css',
            lessons,
            profileImg: user.profile_image,
            currentLesson :function (){
                const current = lessons.find(lesson=>lesson.id == lessonID);
                return current.lesson_url;
            }
        })
    };
});

router.get('/store', async (req, res) => {

    const [courses] = await new CoursesDAO().getAllCourses();

    res.render('store.handlebars', {
        style: '/styles/naginattaz.min.css',
        storeStyle: '/styles/store.css',
        courses
    })
});

export default router;