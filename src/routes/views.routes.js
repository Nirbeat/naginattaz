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
                [courses] = await new CoursesDAO().getAllClasses();
            }
            else{
                courses = await new CoursesDAO().getUserAvailableClasses(user.email);
            }
        }

        if (section == 'clases-individuales') {
            if (user.role == 'premium') {
                [courses] = await new CoursesDAO().getAllClasses();
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
    try {
        const coursesDao = new CoursesDAO();
        const { user } = req;
        let { courseID, lessonID } = req.params;
        // Obtener las clases
        const [lessons] = await coursesDao.getClassLessonsById(courseID);
        const warmingLesson = await coursesDao.getWarmingClass();
        warmingLesson.class_id = courseID;

        const fullLessons = [warmingLesson, ...lessons];

        // Validar acceso del usuario
        const courseOwned = user.ownedCoursesAndLessons.includes(parseInt(courseID));
        if (user.role !== "premium" && !courseOwned) {
            return res.redirect('/store');
        }

        // Si no hay lessonID, asignar al primer video (sin redirigir)
        if (!lessonID) {
            lessonID = fullLessons[0]?.id; // Usar ID de la primera lección
        }

        // Buscar la lección actual
        const currentLesson = fullLessons.find(lesson => lesson.id ==lessonID);

        if(!currentLesson){
            res.redirect(`/clases/${courseID}`)
        }
        // Obtener los datos del curso
        const [[course]] = await coursesDao.getClassById(courseID);
        console.log('Curso obtenido:', course);

        // Renderizar la página
        res.render('lessons.handlebars', {
            style: '/styles/main.css',
            lessonsStyle: '/styles/lessons.css',
            fullLessons,
            courseName: course.class_name,
            userData: {
                profileImg: user.profile_image
            },
            currentLesson
        });
    } catch (error) {
        next(error);
    }
});





router.get('/store', async (req, res, next) => {

    try {
        const { user } = req;
        const [courses] = await new CoursesDAO().getAllClasses();
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

        // DESCOMENTAR LUEGO
        throw new Error('protegiendo')
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