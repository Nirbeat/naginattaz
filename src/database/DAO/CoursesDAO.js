import { DBConnection } from "../database.js";

export class CoursesDAO{

    async getAllCourses(){

        const courses = await DBConnection.query(
            'SELECT * FROM classes'
        );

        return courses;
    }

    async getCourseLessonsById(id){
        const lessons = await DBConnection.query(
            'SELECT * FROM LESSONS WHERE class_id = ?',[id]
        );
        return lessons;
    }

    async getCourseById(id){
        const course = await DBConnection.query(
            'SELECT * FROM classes WHERE id = ?', [id]
        )
        return course;
    }
}