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
            `SELECT classes.id FROM classes 
            JOIN purchases ON classes.id = purchases.class_id 
            JOIN users ON purchases.user_id = users.id WHERE users.email = ?`,
            [email]
        )
    }

    async setRoleByUserEmail(role, email){
        await DBConnection.query(
            'UPDATE users SET role = ? WHERE email = ?',
            [role, email]
        )
    }

    async getPremiumUsers(){
        return await DBConnection.query(
            'SELECT name, email, instagramURL, role FROM users WHERE role = "premium"'
        )
    }
}