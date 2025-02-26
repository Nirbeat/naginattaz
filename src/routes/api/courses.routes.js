import { Router } from "express";
import { CoursesDAO } from "../../database/DAO/CoursesDAO.js";
const router = Router()

router.get('/', async (req, res) => {

    const [[courses]] = await new CoursesDAO().getAllCourses();
    res.json(courses)
})

export default router;