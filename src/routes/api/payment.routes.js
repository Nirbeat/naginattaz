import { json, Router } from "express";
import { CoursesDAO } from "../../database/DAO/CoursesDAO.js";
import { paymentProcessing } from "../../config/mercadopago.js";
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
    console.log(req.cookies)
    res.redirect('/login');
});

router.get('/suscription', async (req, res) => {

    try {

        const { user } = req;
        if (!user) res.redirect('/login')
        if (user.role == 'premium') res.redirect('/entrenamiento')
        else {
            const userId = await new UserDTO().extractUserId(user)
            await new PurchasesDAO().saveSubscription(userId)
            res.redirect(environment.dlocal.subscription)
        }
    } catch (error) {
        console.log(error.message)
    }

})
router.use(json());
router.post('/suscription-notification', async (req, res)=> {
    console.log("cuerpo de la notificacion", req.body)
    const {subscriptionId} = req.body;
    console.log(subscriptionId)
    await new PurchasesDAO().confirmSubscription(subscriptionId);
})

// esto de momento dejarlo
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