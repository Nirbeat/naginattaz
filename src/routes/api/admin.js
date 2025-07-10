import { json, Router, urlencoded } from "express";
import { customVerification, ensureAdmin, ensureAuthenticated } from "../../middlewares/authToken.js";
import { UsersDAO } from "../../database/DAO/UsersDAO.js";

const router = Router();

router.use(urlencoded({extended:true}));
// router.use(customVerification);
// router.use(ensureAuthenticated);
// router.use(ensureAdmin);

router.get('/users/find', async (req, res, next) => {
    
    const {email} = req.query;
    const [user] = await new UsersDAO().getUserByEmail(email);

    res.json(user);
});

router.use(json());

router.post('/users/set-role', async (req,res, next)=> {

    const {newRole, email} = req.body;
    console.log(req.body)
    try {
        new UsersDAO().setRoleByUserEmail(newRole, email)
        .then(()=>res.json({success:`El rol ${newRole} para el mail ${email} se ha actualizado correctamente`}));        
    } catch (error) {
        
    }

    // console.log(newRole);
})
export default router;

