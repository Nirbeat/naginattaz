import { Router } from "express";
<<<<<<< HEAD
import { UserDao } from "../database/DAO/UserDAO.js";
// import { customVerification, ensureAuthenticated } from "../middlewares/authToken.js";
=======
import { UsersDAO } from "../database/DAO/UsersDAO.js";
import { customVerification, ensureAuthenticated } from "../middlewares/authToken.js";
>>>>>>> production
import { CoursesDAO } from "../database/DAO/CoursesDAO.js";
import { viewsRoutesErrorHandler } from "../middlewares/routes.js";

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
        style: '/styles/main.css',
        loginStyles: '/styles/login.css'
    });
});

// router.use(customVerification);

router.get('/', async (req, res) => {
<<<<<<< HEAD
    const user = req.user || defaultUser;
    res.render('index.handlebars', {
        // style: '/styles/originales/naginattaz.min.css',
        // indexStyle: '/styles/originales/index.css',
        style: '/styles/main.css',
        indexStyle: '/styles/index.css',
        images: images,
=======

    const { user } = req;
    res.render('index.handlebars', {
        style: '/styles/main.css',
        indexStyle: '/styles/index.css',
        profileStyle: '/styles/profile.css',
        userData: user ? {
            name: user.name,
            profileImg: user.profile_image
        } : null,
        images: {
            banners: {
                mobile: { first: '/images/banners/BANNERPRINCIPAL_1_mob.png', second: '/images/banners/BANNERPRINCIPAL_2_mob.png' },
                web: { first: '/images/banners/BANNERPRINCIPAL_1.png', second: '/images/banners/BANNERPRINCIPAL_2.png' }
            }
        },
>>>>>>> production
        user
    });
});

router.get('/terms', async (req, res) => {
    res.render('condition-terms.handlebars', {
<<<<<<< HEAD
    // res.render('originales/condition-terms.handlebars', {
        // style: '/styles/originales/styles/naginattaz.min.css',
        // legalStyle: '/styles/originales/styles/legals.css'
        style: '/styles/main.css',
        legalStyle: '/styles/legals.css',
        images: images
=======
        style: '/styles/main.css',
        legalStyle: '/styles/legals.css'
>>>>>>> production
    });
});

router.get('/policies', async (req, res) => {
    res.render('policy.handlebars', {
<<<<<<< HEAD
    // res.render('originales/policy.handlebars', {
        // style: '/styles/naginattaz.min.css',
        // legalStyle: '/styles/legals.css'
        style: '/styles/main.css',
        legalStyle: '/styles/policy.css',
        images: images
=======
        style: '/styles/main.css',
        legalStyle: '/styles/policy.css'
>>>>>>> production
    });
});

router.get('/team', async (req, res) => {
<<<<<<< HEAD
    let [teamMembers] = await new UserDao().getTeamMembers();
=======

    const { user } = req;
    console.log(user)
    let [teamMembers] = await new UsersDAO().getTeamMembers();

>>>>>>> production
    // PASAR LUEGO A UN DTO
    teamMembers = teamMembers.map(({ name, skills, instagramURL, tiktokURL, profile_image }) => {
        return {
            name, skills, instagramURL, tiktokURL, profile_image
        }
<<<<<<< HEAD
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
            // style: '/styles/naginattaz.min.css',
            // lessonsStyle: '/styles/lessons.css',
            style: '/styles/main.css',
            lessonsStyle: '/styles/lessons.css',
            lessons,
            profileImg: user.profile_image || defaultUser.profile_image,
            currentLesson: function () {
                const current = lessons.find(lesson => lesson.id == lessonID);
                return current.lesson_url;
            }
        });
=======
    })
    res.render('team.handlebars', {
        style: '/styles/main.css',
        teamStyles: '/styles/team.css',
        profileStyle: '/styles/profile.css',
        userData: user ? {
            name: user.name,
            profileImg: user.profile_image
        } : null,
        teamMembers
    });
});

router.use(ensureAuthenticated);

router.get('/entrenamiento/:section?', async (req, res, next) => {

    try {
        let [courses] = await new CoursesDAO().getAllCourses();
        const { section } = req.params;
        const { user } = req;

        if (!section) { res.redirect('/entrenamiento/todas-las-clases') }

        if (section == 'clases-individuales') {
            courses = courses.filter(course => course.program == null)
        }

        if (['programas', 'estilos', 'playlists', 'calendario', 'comunidad'].includes(section)) {
            res.redirect('/construccion')
        }

        res.render('training.handlebars', {
            style: '/styles/main.css',
            trainingStyle: '/styles/training.css',
            userData: {
                name: user.name,
                profileImg: user.profile_image
            },
            courses
        })

    } catch (error) {
        next(error)
>>>>>>> production
    }
});

router.get('/clases/:courseID/:lessonID?', async (req, res, next) => {
    // console.log('Request received for courseID:', req.params.courseID);

    try {

        const coursesDao = new CoursesDAO();
        const { user } = req;
        let { courseID, lessonID } = req.params;
        const [lessons] = await coursesDao.getCourseLessonsById(courseID);

        const courseOwned = user.ownedCoursesAndLessons.includes(parseInt(courseID))
        if (user.role != "premium" && !courseOwned) res.redirect('/store')
        else {
            // ESTO REDIRECCIONA AL PRIMER VIDEO DEL CURSO
            if (!lessonID) {
                lessonID = lessons[0].id;
                res.status().redirect(`/clases/${courseID}/${lessonID}`)
            }
            else {
                const [[course]] = await coursesDao.getClassById(courseID);
                res.render('lessons.handlebars', {
                    style: '/styles/main.css',
                    lessonsStyle: '/styles/lessons.css',
                    lessons,
                    courseName: course.class_name,
                    userData: {
                        profileImg: user.profile_image
                    },
                    currentLesson: function () {
                        const current = lessons.find(lesson => lesson.id == lessonID);
                        return current.lesson_url;
                    }
                })
            };
        }
    } catch (error) {
        next(error)
    }
});

router.get('/store', async (req, res, next) => {

    try {
        const { user } = req;
        const [courses] = await new CoursesDAO().getAllCourses();
        res.render('store.handlebars', {
            style: '/styles/main.css',
            storeStyle: '/styles/store.css',
            profileStyle: '/styles/profile.css',
            courses,
            userData: user ? {
                name: user.name,
                profileImg: user.profile_image
            } : null,
            images: {
                banners: {
                    mobile: { first: '/images/banners/BANNERPRINCIPAL_1_mob.png', second: '/images/banners/BANNERPRINCIPAL_2_mob.png' },
                    web: { first: '/images/banners/BANNERPRINCIPAL_1.png', second: '/images/banners/BANNERPRINCIPAL_2.png', store: 'images/banners/BannerNag2.jpg' },
                }
            }
        })
    } catch (error) {
        next(error)
    }
});

router.get('/payment/:preferenceID', async (req, res, next) => {
    try {

        res.render('payment.handlebars', {
            style: "/styles/main.css"

        });
    } catch (error) {
        next(error)
    }
});

router.get('/construccion', (req, res, next) => {

    try {
        res.render('construction.handlebars', {
            style: '/styles/main.css',
            constructionStyle: '/styles/construction.css',
            workerSvg: '/images/worker.svg'
        });
    } catch (error) {
        next(error);
    }
});

router.get('*', (req, res, next) => {
    try {

        res.render('construction.handlebars', {
            style: '/styles/main.css',
            constructionStyle: '/styles/construction.css',
            workerSvg: '/images/worker.svg'
        })
    } catch (error) {
        next(error)
    }
});

router.use(viewsRoutesErrorHandler);
export default router;