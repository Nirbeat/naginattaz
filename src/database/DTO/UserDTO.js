import { UsersDAO } from "../DAO/UsersDAO.js";

export class UserDTO{

    userJWT(user){

        const {name, email, role, profile_image, ownedCoursesAndLessons = []} = user;

        return {
            name, email, role, profile_image, ownedCoursesAndLessons
        }
    }

    async extractUserId(user){

        const {email} = user;
        const [[{id : userID}]] = await new UsersDAO().getUserByEmail(email)
        return userID
    }
}