import { Router } from "express";
import { UsersDAO } from "../database/DAO/UsersDAO.js";
import { customVerification, ensureAuthenticated } from "../middlewares/authToken.js";
import { CoursesDAO } from "../database/DAO/CoursesDAO.js";
import { viewsRoutesErrorHandler } from "../middlewares/routes.js";

const router = Router();

router.get('/login', async (req, res) => {

    res.render('login.handlebars', {
        style: '/styles/main.css',
        loginStyles: '/styles/login.css'
    });
});

router.use(customVerification);

router.get('/', async (req, res) => {

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
        user
    });
});

router.get('/terms', async (req, res) => {

    res.render('condition-terms.handlebars', {
        style: '/styles/main.css',
        legalStyle: '/styles/legals.css'
    });
});

router.get('/policies', async (req, res) => {
    res.render('policy.handlebars', {
        style: '/styles/main.css',
        legalStyle: '/styles/policy.css'
    });
});

router.get('/team', async (req, res) => {

    const { user } = req;
    console.log(user)
    let [teamMembers] = await new UsersDAO().getTeamMembers();

    // PASAR LUEGO A UN DTO
    teamMembers = teamMembers.map(({ name, skills, instagramURL, tiktokURL, profile_image }) => {
        return {
            name, skills, instagramURL, tiktokURL, profile_image
        }
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
        let courses;
        let userPremium = null;
        const { section = 'todas-las-clases' } = req.params;
        const { user } = req;

        if(section == 'todas-las-clases'){
            if(user.role == 'premium'){
                courses = await new CoursesDAO().getAllClasses();
            }
            else{
                courses = await new CoursesDAO().getUserAvailableClasses(user.email);
            }
        }

        if (section == 'clases-individuales') {
            if (user.role == 'premium') {
                courses = await new CoursesDAO().getAllClasses();
                courses = courses.filter(course => course.program_module_id == null)
            }else {
                courses = await new CoursesDAO().getUserAvailableClasses(user.email);
            }
        }
        

        if (section == 'programas') {
            if (user.role == 'premium') {
                [courses] = await new CoursesDAO().getAllPrograms();
                userPremium = true;
            }else {
                courses = null;
            }
        }

        if (['estilos', 'playlists', 'calendario', 'comunidad'].includes(section)) {
            res.redirect('/construccion')
        }

        res.render('training.handlebars', {
            style: '/styles/main.css',
            trainingStyle: '/styles/training.css',
            userData: {
                name: user.name,
                profileImg: user.profile_image,
            },
            userPremium,
            courses
        })

    } catch (error) {
        next(error)
    }
});

// NUEVA RUTA PARA VISUALIZAR PROGRAMAS
router.get('/clases/programa/:programID/:courseID/:lessonID?', async (req, res, next) => {

    const { courseID, programID, lessonID } = req.params;

    try {
        const programs = await new CoursesDAO().getProgramById(programID)

    } catch (error) {
        next(error)
    }
})

router.get('/clases/:courseID/:lessonID?', async (req, res, next) => {
    // console.log('Request received for courseID:', req.params.courseID);

    try {

        const coursesDao = new CoursesDAO();
        const { user } = req;
        let { courseID, lessonID } = req.params;
        const [lessons] = await coursesDao.getClassLessonsById(courseID);

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
        const [courses] = await new CoursesDAO().getAllClasses();
        console.log(courses)
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