import { Router } from "express";
import { CoursesDAO } from "../../database/DAO/CoursesDAO.js";
import { paymentProcessing, suscriptionPayment } from "../../config/mercadopago.js";
import { PurchasesDAO } from "../../database/DAO/PurchasesDAO.js";
import { customVerification } from "../../middlewares/authToken.js";
import { createToken } from "../../config/jwt.js";
import { UsersDAO } from "../../database/DAO/UsersDAO.js";
import { UserDTO } from "../../database/DTO/UserDTO.js";
import { environment } from "../../config/env.js";
import { suscriptionMessage } from "../../config/mailing/mailing.js";

const router = Router();

router.use(customVerification)

router.get('/public-key', async (req, res) => {

    res.json({ MPPublicKey: environment.mercadopago.publicKey })
})

router.get('/success', async (req, res) => {

    const { user } = req;
    const { purchaseData } = req.cookies;
    const [[findUser]] = await new UsersDAO().getUserByEmail(user.email);

    if (purchaseData) {
        user.ownedCoursesAndLessons.push(purchaseData.courseId);
        await new PurchasesDAO().saveClassPurchase(findUser.id, parseInt(purchaseData.courseId));
        res.cookie('jwt', createToken(user), { maxAge: 1000 * 60 * 60 * 24 }).redirect(`/clases/${courseId}`);
    } else {
        await new PurchasesDAO().saveSubscription(await new UserDTO().extractUserId(user));
        await new UsersDAO().setRoleByUserEmail('premium', user.email);
        await suscriptionMessage(user);
        res.cookie('jwt', createToken(user)).redirect(`/entrenamiento`);
    }

});
router.get('/suscription', async (req, res) => {

    try {

        const { user } = req;
        if (!user) res.redirect('/login')
        else {
            if (user.role == 'premium') res.redirect('/entrenamiento')
            else {
                const { id } = await suscriptionPayment();
                res.redirect('/suscribete/' + id)
            }
        }

    } catch (error) {
        console.log(error.message)
    }

})

router.get('/:courseID', async (req, res) => {

    const { user } = req;
    const { courseID } = req.params

    if(!user) res.redirect('/login');
    try {
        if (user.ownedCoursesAndLessons.includes(courseID)) {
            res.redirect(`/clases/${courseID}`)
        } else {
            const [[courses]] = await new CoursesDAO().getClassById(courseID);

            const { items: course, id } = await paymentProcessing(courses);
            res.cookie('purchaseData', { courseId: course[0].id }, { httpOnly: true, maxAge: 30 * 60 * 1000 }).redirect(`/payment/${id}`)
        }

    } catch (error) {
        console.log(error)
    }
});


export default router;