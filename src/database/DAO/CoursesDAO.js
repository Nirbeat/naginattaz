import { DBConnection } from "../database.js";

export class CoursesDAO{

    async getAllCourses(){

        const courses = await DBConnection.query(
            'SELECT * FROM courses'
        );

        return courses;
    }

    async getCourseLessonsById(id){
        const lessons = await DBConnection.query(
            'SELECT * FROM LESSONS WHERE course_id = ?',[id]
        );
        return lessons;
    }

    async getCourseById(id){
        const course = await DBConnection.query(
            'SELECT * FROM courses WHERE id = ?', [id]
        )
        return course;
    }
}