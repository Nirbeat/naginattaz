import { json, Router } from "express";
import { CoursesDAO } from "../../database/DAO/CoursesDAO.js";
import { UserDTO } from "../../database/DTO/UserDTO.js";
import { PurchasesDAO } from "../../database/DAO/PurchasesDAO.js";
import { customVerification } from "../../middlewares/authToken.js";
import { environment } from "../../config/env.js";
import { suscriptionMessage } from "../../config/mailing/mailing.js";

const router = Router();

router.use(customVerification);

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

router.get('/cancel-suscription', async (req, res) => {
    const { user } = req;
    const userID = await new UserDTO().extractUserId(user)
    const purchasesDao = new PurchasesDAO()
    const { subscriptionPlanId, subscriptionCancelAPI, key, secret } = environment.dlocal;

    const activeSubscription = await purchasesDao.getSubscriptionIdByUserId(userID);

    fetch(`${subscriptionCancelAPI}/${subscriptionPlanId}/subscription/${activeSubscription}/deactivate`,
        {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${key}:${secret}`,
                "Content-Type": "application/json"
            }
        }
    )
    .then(data=> {
        if (data.status == 200){
            purchasesDao.cancelSubscription(userID);
            res.redirect('/login');
        }
    })
    .catch(error=>{
        console.log(error)
    })
});

router.use(json());

router.get('/:courseID', async (req, res) => {
    try {
        const userID = await new UserDTO().extractUserId(req.user);
        const { courseID } = req.params;
        const { key, secret, paymentURL } = environment.dlocal;
        const { redirectURL: myDomain } = environment.googleAuth;

        let [[course]] = await new CoursesDAO().getClassById(courseID);

        const notificationURL = `${myDomain}/api/payment/courses-notification/${userID}/${courseID}`

        const { redirect_url } = await fetch(paymentURL,
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

// ACA LLEGAN TODOS LOS UPDATES DE LAS SUSCRIPCIONES
router.post('/suscription-notification', async (req, res) => {
    const { subscriptionId } = req.body;
    await new PurchasesDAO().confirmSubscription(subscriptionId);
})

// ACA LLEGAN LAS NOTIFICACIONES DE LAS COMPRAS INDIVIDUALES
router.post('/courses-notification/:userID/:courseID', async (req, res) => {
    const { userID, courseID } = req.params;
    new PurchasesDAO().saveClassPurchase(userID, courseID, "class");
})


export default router;