import { DBConnection } from "../database.js";

export class CoursesDAO{

    async getAllCourses(){

        const courses = (await DBConnection).query(
            'SELECT * FROM courses'
        );

        return courses;
    }
}