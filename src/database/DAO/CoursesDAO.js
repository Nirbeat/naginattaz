import { DBConnection } from "../database.js";
import { UsersDAO } from "./UsersDAO.js";

export class CoursesDAO{

    async getAllPrograms(){
        const programs = await DBConnection.query(
            'SELECT * FROM programs'
        );

        return programs;
    }

    async getProgramById(programId){

        const program = await DBConnection.query(
            'SELECT * FROM programs WHERE id = ?', [programId]
        );

        return program
    }

    async getAllClasses(){

        const classes = await DBConnection.query(
            'SELECT * FROM classes'
        );

        console.log(`Classes: ${classes}`);

        return classes;
    }

    async getClassLessonsById(id){
        const lessons = await DBConnection.query(
            'SELECT * FROM lessons WHERE class_id = ?',[id]
        );
        return lessons;
    }

    async getClassById(id){
        const course = await DBConnection.query(
            'SELECT * FROM classes WHERE id = ?', [id]
        )
        return course;
    }

    async getUserAvailableClasses(email){
        const [classes] = await new UsersDAO().getOwnedCourses(email);
        const result=[];

        for(let i=0; i<classes.length; i++){
            await this.getClassById(classes[i].id).then(([[course]]) => result.push(course))
        }
        return result;
    }
}