import { DBConnection } from "../database.js"

export class UsersDAO{

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
        const [newUser] = await DBConnection.query(
            'INSERT INTO users (name, email, profile_image) VALUES (?,?,?)',
            [name, email, profileImageURL]
        )

        return await DBConnection.query(
            'SELECT * FROM users WHERE id = ?',[newUser.insertId]
        );
    }

    async getOwnedCourses(email){
        return await DBConnection.query(
            `SELECT courses.id FROM courses 
            JOIN purchases ON courses.id = purchases.course_id 
            JOIN users ON purchases.user_id = users.id WHERE users.email = ?`,
            [email]
        )
    }
}