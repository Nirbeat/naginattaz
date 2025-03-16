export class UserDTO{

    userJWT(user){

        const {name, email, role, profile_image, ownedCoursesAndLessons = []} = user;

        return {
            name, email, role, profile_image, ownedCoursesAndLessons
        }
    }
}