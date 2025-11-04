import { Router } from "express";
import { UsersDAO } from "../database/DAO/UsersDAO.js";
import { customVerification, ensureAuthenticated } from "../middlewares/authToken.js";
import { CoursesDAO } from "../database/DAO/CoursesDAO.js";
import { ProgramDAO } from "../database/DAO/ProgramDAO.js";
import { PurchasesDAO } from "../database/DAO/PurchasesDAO.js";
import { viewsRoutesErrorHandler } from "../middlewares/routes.js";
import { ProgramDTO } from "../database/DTO/ProgramDTO.js";

const router = Router();

const images = {
    banners: {
        first: '/images/banners/banner1.png',
        second: '/images/banners/banner2.png',
        store: '/images/banners/store.jpg'
    },
    tecnicas: {
        afro: '/images/tecnicas/afro.png',
        afro_soon: '/images/tecnicas/afro_soon.png',
        dance_hall: '/images/tecnicas/dance_hall.png',
        floorwork: '/images/tecnicas/floorwork.png',
        heels: '/images/tecnicas/heels.png',
        herramientas: '/images/tecnicas/herramientas.png',
        hiphop: '/images/tecnicas/hiphop.png',
        house_dance: '/images/tecnicas/house_dance.png',
        lite_feet: '/images/tecnicas/lite_feet.png',
        lite_feet_soon: '/images/tecnicas/lite_feet_soon.png',
        popping_soon: '/images/tecnicas/popping_soon.png',
        popping: '/images/tecnicas/popping.png',
        vogue_soon: '/images/tecnicas/vogue_soon.png',
        vogue: '/images/tecnicas/vogue.png',
        waacking: '/images/tecnicas/waacking.png'
    }
};

// test programdao getProgramWithPhasesAndModules(programId)

router.get('/testProgramDao/:programId', async (req, res, next) => {

    try {
        const programDAO = new ProgramDAO();
        const programId = req.params.programId;
        const program = await programDAO.getProgramWithPhasesAndModules(programId);

        res.json(program);
    } catch (error) {
        next(error);
    }
});


router.get('/login', async (req, res, next) => {

    try {

        res.render('login.handlebars', {
            style: '/styles/main.css',
            loginStyles: '/styles/login.css'
        });
    } catch (error) {
        next(error)
    }
});

router.use(customVerification);

router.get('/', async (req, res, next) => {

    try {
        const [[{suscription}]] = await new PurchasesDAO().getSuscriptionPrice();
        const { user } = req;
        res.render('index.handlebars', {
            style: '/styles/main.css',
            indexStyle: '/styles/index.css',
            profileStyle: '/styles/profile.css',
            userData: user ? {
                name: user.name,
                profileImg: user.profile_image,
                role: user.role
            } : null,
            images: images,
            user,
            suscription
        });
    } catch (error) {
        next(error)
    }

});

router.get('/terms', async (req, res, next) => {

    try {

        res.render('condition-terms.handlebars', {
            style: '/styles/main.css',
            legalStyle: '/styles/legals.css'
        });
    } catch (error) {
        next(error)
    }
});

router.get('/policies', async (req, res, next) => {
    try {

        res.render('policy.handlebars', {
            style: '/styles/main.css',
            legalStyle: '/styles/policy.css'
        });
    } catch (error) {
        next(error)
    }
});

router.get('/team', async (req, res, next) => {

    try {
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
                profileImg: user.profile_image,
                role: user.role
            } : null,
            teamMembers
        });
    } catch (error) {
        next(error)
    }

});

router.get('/store', async (req, res, next) => {

    let [users] = await new UsersDAO().getTeamMembers();

    const teacherMap = users.reduce((map, user) => {
        map[user.id] = user.name;
        return map;
    }, {});

    try {
        const { user } = req;
        let [courses] = await new CoursesDAO().getAllClasses();
        if (courses) {
            courses = courses.filter(course => course.program_module_id == null)
            courses = courses.map(course => {
                let teacherIds = [];
                try {
                    teacherIds = Array.isArray(course.teachers_id)
                        ? course.teachers_id
                        : JSON.parse(course.teachers_id || '[]');
                } catch (error) {
                    console.error(`Error parsing teachers_id for course ${course.id}:`, error);
                }
                teacherIds = Array.isArray(teacherIds) ? teacherIds : [];
                course.teacherNames = teacherIds.map(id => teacherMap[id] || 'Desconocido');
                return course;
            });
        }

        res.render('store.handlebars', {
            style: '/styles/main.css',
            storeStyle: '/styles/store.css',
            profileStyle: '/styles/profile.css',
            courses,
            userData: user ? {
                name: user.name,
                profileImg: user.profile_image,
                role:user.role
            } : null,
            images: images,
        })
    } catch (error) {
        next(error)
    }
});


router.use(ensureAuthenticated);

router.get('/entrenamiento/:section?', async (req, res, next) => {

    try {
        let courses, programs;
        let [users] = await new UsersDAO().getTeamMembers();

        const teacherMap = users.reduce((map, user) => {
            map[user.id] = user.name;
            return map;
        }, {});

        let userPremium = null;
        const { section = 'todas-las-clases' } = req.params;
        const { user } = req;

        if (section == 'todas-las-clases') {
            if (user.role == 'premium') {
                [courses] = await new CoursesDAO().getAllClasses();
            }
            else {
                courses = await new CoursesDAO().getUserAvailableClasses(user.email);
            }
        }

        if (section == 'clases-individuales') {
            if (user.role == 'premium') {
                [courses] = await new CoursesDAO().getAllClasses();
                courses = courses.filter(course => course.program_module_id == null)
            } else {
                courses = await new CoursesDAO().getUserAvailableClasses(user.email);
            }
        }

        if (section == 'programas') {
            if (user.role == 'premium') {
                [programs] = await new CoursesDAO().getAllPrograms();
                const programDTO = new ProgramDTO();

                await Promise.all(programs.map(async program=>{
                    const programLink = await programDTO.setProgramCardLink(program.id)
                    program.link = programLink
                }));
                userPremium = true;
            } else {
                courses = null;
            }
        }

        if (['estilos', 'playlists', 'calendario', 'comunidad'].includes(section)) {
            res.redirect('/construccion')
        }

        if (courses) {
            courses = courses.map(course => {
                let teacherIds = [];
                try {
                    teacherIds = Array.isArray(course.teachers_id)
                        ? course.teachers_id
                        : JSON.parse(course.teachers_id || '[]');
                } catch (error) {
                    console.error(`Error parsing teachers_id for course ${course.id}:`, error);
                }
                teacherIds = Array.isArray(teacherIds) ? teacherIds : [];
                course.teacherNames = teacherIds.map(id => teacherMap[id] || 'Desconocido');
                return course;
            });
        }

        res.render('training.handlebars', {
            style: '/styles/main.css',
            trainingStyle: '/styles/training.css',
            userData: {
                name: user.name,
                profileImg: user.profile_image,
                role: user.role
            },
            userPremium,
            courses,
            programs,
            users
        })

    } catch (error) {
        next(error)
    }
});

// RUTA PARA LOS PROGRAMAS, BÁSICAMENTE UN CLON DE LAS CLASES CON
// PASOS EXTRA
router.get('/programas/:programID/:phaseID?/:moduleID?/:courseID?/:lessonID?', async (req, res, next) => {

    try {

        const { user } = req;
        let { courseID, lessonID, programID, phaseID, moduleID } = req.params;
        const coursesDao = new CoursesDAO()

        const program = await new ProgramDAO().getProgramWithPhasesAndModules(parseInt(programID));

        const phaseIndex = program.phases.findIndex(phase => phase.phase_id == phaseID);
        const moduleIndex = program.phases[phaseIndex].modules.findIndex(module => module.module_id == moduleID)
        const classIndex = program.phases[phaseIndex].modules[moduleIndex].classes.findIndex(course => course.class_id == courseID)
        const currentLesson = program.phases[phaseIndex].modules[moduleIndex].classes[classIndex].lessons.find(lesson => lesson.lesson_id == lessonID)
        
        await coursesDao.setClassViews(courseID, user.name, user.role);

        res.render('program.handlebars', {
            style: '/styles/main.css',
            lessonsStyle: '/styles/lessons.css',
            program,
            userData: {
                profileImg: user.profile_image
            },
            currentLesson
        });
    } catch (error) {
        console.log(error)
    }
});

router.get('/clases/:courseID/:lessonID?', async (req, res, next) => {
    try {
        const coursesDao = new CoursesDAO();
        const { user } = req;
        let { courseID, lessonID } = req.params;

        const [lessons] = await coursesDao.getClassLessonsById(courseID);
        const warmingLesson = await coursesDao.getWarmingClass();
        const finalLesson = await coursesDao.getFinalLesson();

        warmingLesson.class_id = courseID;
        finalLesson.class_id = courseID;

        const fullLessons = [warmingLesson, ...lessons, finalLesson];

        const courseOwned = user.ownedCoursesAndLessons.includes(parseInt(courseID));
        if (user.role !== "premium" && !courseOwned) {
            return res.redirect('/store');
        }

        if (!lessonID) {
            lessonID = fullLessons[0]?.id;
        }

        const currentLesson = fullLessons.find(lesson => lesson.id == lessonID);

        if (!currentLesson) {
            res.redirect(`/clases/${courseID}`)
        }

        const [[course]] = await coursesDao.getClassById(courseID);

        const teacher = JSON.parse(course.teachers_id)

        const { name: teacherName } = await coursesDao.getTeachersNameById(teacher)
        // ANALIZAR PONER ESTO EN MIDDLEWARE
        await coursesDao.setClassViews(courseID, user.name, user.role);

        res.render('lessons.handlebars', {
            style: '/styles/main.css',
            lessonsStyle: '/styles/lessons.css',
            fullLessons,
            teacherName,
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

router.get('/suscribete/:preferenceID', async (req, res, next) => {
    try {

        res.render('payment.handlebars', {
            style: "/styles/main.css"
        });
    } catch (error) {
        next(error)
    }
})

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
            workerSvg: '/images/worker.svg',
            title: 'Página bajo construcción',
            message: 'Estamos trabajando duro para brindarles el mejor contenido. Por favor vuelva más tarde.'
        });
    } catch (error) {
        next(error);
    }
});

router.get('/transaccion-pendiente', async (req, res) => {
    res.render('construction.handlebars', {
            style: '/styles/main.css',
            constructionStyle: '/styles/construction.css',
            workerSvg: '/images/worker.svg',
            title: 'Servidor ocupado',
            message: 'Estamos procesando muchas solicitudes, reintente en unos minutos.'
        });
})

router.get('*', (req, res, next) => {
    try {

        res.render('construction.handlebars', {
            style: '/styles/main.css',
            constructionStyle: '/styles/construction.css',
            workerSvg: '/images/worker.svg',
            title: 'Página bajo construcción',
            message: 'Estamos trabajando duro para brindarles el mejor contenido. Por favor vuelva más tarde.'
        })
    } catch (error) {
        next(error)
    }
});

router.get('/server-error', async (err, req, res, next) => {
    try {
        res.render('server-error.handlebars', {
            error: err.message
        })
    } catch (error) {
        next(error)
    }
})
router.use(viewsRoutesErrorHandler);
export default router;