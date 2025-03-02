import { Router } from "express";
import { CoursesDAO } from "../../database/DAO/CoursesDAO.js";
import { paymentProcessing } from "../../config/mercadopago.js";

const router = Router();

router.get('/:courseID', async (req, res) => {

    const {courseID} = req.params
    const [[courses]] = await new CoursesDAO().getCourseById(courseID);

    try {
        const data = await paymentProcessing(courses);
        req.preferenceID = data.id;
        res.redirect(`/payment/${data.id}`)
    } catch (error) {
        console.log(error.message)
    }
});

export default router;