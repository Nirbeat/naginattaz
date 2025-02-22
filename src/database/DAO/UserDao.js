import { DBConnection } from "../database.js"

export class UserDao{

    async getTeamMembers(){

        return (await DBConnection).query(
            'SELECT * FROM users WHERE role = "profesor";'
        )
    }

//     async addUser(name, email, skills, password, instagramURL, tiktokURL, profileImageURL){

//     }

}