import { DBConnection } from "../database.js"

export class UserDao{

    async getTeamMembers(){

        return await DBConnection.query(
            'SELECT * FROM users WHERE role = "profesor";'
        )
    }
    async getUserByEmail(email){
        return await DBConnection.query(
            'SELECT * FROM users WHERE email = ?',[email]
        )
    }
    async addUser({name, email, skills, password, instagramURL, tiktokURL, profileImageURL}){
        return await DBConnection.query(
            'INSERT INTO users (name, email, profile_image) VALUES (?,?,?)',
            [name, email, profileImageURL]
        )
    }

    async getOwnedCourses(email){
        return await DBConnection.query(
            `SELECT course_id FROM courses 
            JOIN purchases ON courses.id = purchases.course_id 
            JOIN users ON purchases.user_id = users.id WHERE users.email = ?`,
            [email]
        )
    }
}