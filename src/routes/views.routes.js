import { Router } from "express";
import { UserDao } from "../database/DAO/UserDAO.js";
// import { customVerification, ensureAuthenticated } from "../middlewares/authToken.js";
import { CoursesDAO } from "../database/DAO/CoursesDAO.js";

const router = Router();

// Default user object for testing purposes
const defaultUser = {
    name: "Test User",
    profile_image: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=BeardMajestic&facialHairColor=Auburn&clotheType=GraphicShirt&clotheColor=Blue02&graphicType=Skull&eyeType=Squint&eyebrowType=RaisedExcitedNatural&mouthType=Sad&skinColor=Light"
};

const images = {
    cart: '/images/cart.png',
    mainLogo: '/images/main-logo.png',
    banners: {
        mobile: { first: '/images/banners/BANNERPRINCIPAL_1_mob.png', second: '/images/banners/BANNERPRINCIPAL_2_mob.png' },
        web: { first: '/images/banners/BANNERPRINCIPAL_1.png', second: '/images/banners/BANNERPRINCIPAL_2.png' }
    }
}

router.get('/login', async (req, res) => {
    res.render('login.handlebars', {
        style: '/styles/naginattaz.min.css',
        loginStyles: '/styles/login.css'
    });
});

// router.use(customVerification);

router.get('/', async (req, res) => {
    const user = req.user || defaultUser;
    res.render('index.handlebars', {
        // style: '/styles/originales/naginattaz.min.css',
        // indexStyle: '/styles/originales/index.css',
        style: '/styles/main.css',
        indexStyle: '/styles/index.css',
        images: images,
        user
    });
});

router.get('/terms', async (req, res) => {
    res.render('condition-terms.handlebars', {
    // res.render('originales/condition-terms.handlebars', {
        // style: '/styles/originales/styles/naginattaz.min.css',
        // legalStyle: '/styles/originales/styles/legals.css'
        style: '/styles/main.css',
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
    });
    res.render('TEAM.handlebars', {
        // style: '/styles/naginattaz.min.css',
        style: '/styles/main.css',
        teamMembers,
        teamStyles: '/styles/team.css',
        images: images
    });
});

// router.use(ensureAuthenticated);

router.get('/entrenamiento', async (req, res) => {
    const [courses] = await new CoursesDAO().getAllCourses();
    const user = req.user || defaultUser;
    // res.render('originales/training.handlebars', {
    res.render('training.handlebars', {
        // style: '/styles/originales/naginattaz.min.css',
        // trainingStyle: '/styles/originales/training.css',
        style: '/styles/main.css',
        trainingStyle: '/styles/training.css',
        userData: {
            name: user.name,
            profileImg: user.profile_image
        },
        courses
    });
});

router.get('/clases/:courseID/:lessonID?', async (req, res) => {
    const user = req.user || defaultUser;
    let { courseID, lessonID } = req.params;
    const [lessons] = await new CoursesDAO().getCourseLessonsById(courseID);
    if (!lessonID) {
        lessonID = lessons[0].id;
        res.status().redirect(`/clases/${courseID}/${lessonID}`);
    } else {
        res.render('lessons.handlebars', {
            style: '/styles/naginattaz.min.css',
            lessonsStyle: '/styles/lessons.css',
            lessons,
            profileImg: user.profile_image,
            currentLesson: function () {
                const current = lessons.find(lesson => lesson.id == lessonID);
                return current.lesson_url;
            }
        });
    }
});

export default router;