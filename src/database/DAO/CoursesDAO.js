import { DBConnection } from "../database.js";
import { UsersDAO } from "./UsersDAO.js";


export class CoursesDAO {

    async getTeachersNameById(teachersId) {

        // const query = teachersId.toLocaleString()
        const [[teacher]] = await DBConnection.query(
            'SELECT name FROM users WHERE id IN (?)',
            [teachersId]
        );

        return teacher;
    }

    async getAllPrograms() {
        const programs = await DBConnection.query(
            'SELECT * FROM programs'
        );

        return programs;
    }

    async getProgramById(programId) {

        const [program] = await DBConnection.query(
            `select program_name, phase_name, module_name, class_name, lesson_url, name from programs 
join program_phases 
join program_modules 
join classes 
join lessons 
where programs.id = 1 
and program_phases.program_id = programs.id 
and program_modules.phase_id = program_phases.id 
and classes.program_module_id = program_modules.id 
and lessons.class_id = classes.id;`, [programId]
        );

        const programObject = {
            programName : program[0].program_name,
            programPhases: new Set(program.map(result=> result.phase_name))
        };
        return program
    }

    async getWarmingClass() {
        const [warmings] = await DBConnection.query(
            'SELECT * FROM  lessons WHERE name = "Calentamiento"'
        );

        const index = Math.floor(Math.random() * warmings.length);
        return warmings[index];
    }

    async getFinalLesson() {
        const [[final]] = await DBConnection.query(
            'SELECT * FROM lessons WHERE name = "Final de clase"'
        );

        return final;
    }
    async getAllClasses() {

        const classes = await DBConnection.query(
            'SELECT * FROM classes'
        );

        return classes;
    }

    async getClassLessonsById(id) {
        const lessons = await DBConnection.query(
            'SELECT * FROM lessons WHERE class_id = ?', [id]
        );
        return lessons;
    }

    async getClassById(id) {
        const course = await DBConnection.query(
            'SELECT * FROM classes WHERE id = ?', [id]
        )
        return course;
    }

    async getUserAvailableClasses(email) {
        const [classes] = await new UsersDAO().getOwnedCourses(email);
        const result = [];

        for (let i = 0; i < classes.length; i++) {
            await this.getClassById(classes[i].id).then(([[course]]) => result.push(course))
        }
        return result;
    }
}

// await new CoursesDAO().getProgramById(1)