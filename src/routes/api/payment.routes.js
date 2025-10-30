import { json, Router } from "express";
import { CoursesDAO } from "../../database/DAO/CoursesDAO.js";
import { UserDTO } from "../../database/DTO/UserDTO.js";
import { paymentProcessing } from "../../config/mercadopago.js";
import { PurchasesDAO } from "../../database/DAO/PurchasesDAO.js";
import { customVerification } from "../../middlewares/authToken.js";
import { environment } from "../../config/env.js";
import { suscriptionMessage } from "../../config/mailing/mailing.js";

const router = Router();

router.use(customVerification)

router.get('/public-key', async (req, res) => {

    res.json({ MPPublicKey: environment.mercadopago.publicKey })
})

router.get('/success', async (req, res) => {
    const { user } = req;
    await suscriptionMessage(user);
    res.redirect('/login');
});

router.get('/suscription', async (req, res) => {

    try {
        const { user } = req;
        if (!user) res.redirect('/login')
        if (user.role == 'premium') res.redirect('/entrenamiento')
        else {
            const userId = await new UserDTO().extractUserId(user)
            const transaction = await new PurchasesDAO().saveSubscription(userId)
            if (transaction == 0) {
                res.redirect('/transaccion-pendiente')
            } else {
                res.redirect(environment.dlocal.subscription)
            }
        }
    } catch (error) {
        console.log(error)
    }

})

router.use(json());

// esto de momento dejarlo
router.get('/:courseID', async (req, res) => {
    try {
        const userID = await new UserDTO().extractUserId(req.user);
        const { courseID } = req.params;
        const { key, secret, paymentURL } = environment.dlocal;
        const {redirectURL : myDomain} = environment.googleAuth;

        let [[course]] = await new CoursesDAO().getClassById(courseID);

        console.log(course)
        console.log(course.class_price)
        const notificationURL = `${myDomain}/api/payment/courses-notification/${userID}/${courseID}`

        const {redirect_url} = await fetch(paymentURL,
            {
                method: "POST",
                body: JSON.stringify({
                    currency: "USD",
                    amount: course.class_price,
                    notification_url: notificationURL,
                    success_url: `${myDomain}/login`
                }),
                headers: {
                    "Authorization": `Bearer ${key}:${secret}`,
                    "Content-Type": "application/json"
                }
            })
            .then(data => data.json())

            res.redirect(redirect_url);

    } catch (error) {
        console.log(error)
    }
});

router.post('/suscription-notification', async (req, res) => {
    console.log("cuerpo de la notificacion", req.body)
    const { subscriptionId } = req.body;
    await new PurchasesDAO().confirmSubscription(subscriptionId);
})

router.post('/courses-notification/:userID/:courseID', async (req, res) => {
    const {userID, courseID} = req.params;
    new PurchasesDAO().saveClassPurchase(userID, courseID, "class");
    console.log(`el usuario ${userID} compro el curso ${courseID}`)
    console.log(req.body)
})


export default router;