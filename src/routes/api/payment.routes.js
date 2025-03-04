import { Router } from "express";
import { CoursesDAO } from "../../database/DAO/CoursesDAO.js";
import { paymentProcessing } from "../../config/mercadopago.js";
import { PurchasesDAO } from "../../database/DAO/PurchasesDAO.js";
import { customVerification } from "../../middlewares/authToken.js";
import { createToken } from "../../config/jwt.js";

const router = Router();

router.use(customVerification)

router.get('/success', async (req, res) => {

    const {courseId} = req.cookies.purchaseData;
    const {user} = req;
    user.ownedCoursesAndLessons.push(courseId);
    await new PurchasesDAO().saveCoursePurchase(user.id, parseInt(courseId));

    res.cookie('jwt',createToken(user)).redirect(`/clases/${courseId}`);
})

router.get('/:courseID', async (req, res) => {

    const {courseID} = req.params
    const [[courses]] = await new CoursesDAO().getCourseById(courseID);
    
    try {
        const {items:course, id} = await paymentProcessing(courses);
        res.cookie('purchaseData', {courseId : course[0].id}, {httpOnly: true, maxAge: 30*60*1000}).redirect(`/payment/${id}`)
    } catch (error) {
        console.log(error.message)
    }
});


export default router;