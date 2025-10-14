import { DBConnection } from "../database.js";
import { UsersDAO } from "./UsersDAO.js";


export class CoursesDAO {

    async getTeachersNameById(teachersId) {

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
            programName: program[0].program_name,
            programPhases: new Set(program.map(result => result.phase_name))
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

    async getClassViewsByPeriod(month, year) {
        const [classesData] = await DBConnection.query(
            `SELECT class_name, teachers_id, views, students FROM classes
            JOIN class_views
            WHERE classes.id = class_views.class_id
            AND class_views.month = ?
            AND class_views.year = ?`,
            [month, year]
        );

        await Promise.all(classesData.map(async (course) => {
            course.teachers = [];

            course.students = JSON.parse(course.students).length;
            const teacherIds = JSON.parse(course.teachers_id);

            for (const teacherId of teacherIds) {
                const teacherData = await this.getTeachersNameById(teacherId);
                course.teachers.push(teacherData.name);
            }
        }));

        return classesData;
    }

    async setClassViewers(classId, userName, userRole) {

        // ALTER TABLE `class_views` ADD `students` JSON NOT NULL DEFAULT '[]' AFTER `month`;
        const [[user]] = await DBConnection.query(
            `SELECT u.id FROM users as u 
            JOIN purchases as p ON p.user_id = u.id
            WHERE u.name = ?
            AND p.purchase_type = "suscription"`,
            [userName]
        )

        if(!user) return

        let [[data]] = await DBConnection.query(
            `SELECT students FROM class_views as c
            WHERE c.class_id = ?
            AND c.year = YEAR(NOW())
            AND c.month = MONTH(NOW())`,
            [classId])

        if (!data) {
            data = {
                students: '[]'
            }
        }
        data.students = JSON.parse(data.students)

        if (!data.students.includes(user.id) && userRole == 'premium') data.students.push(user.id)
        return JSON.stringify(data.students)
    }

    async setClassViews(classId, userName, userRole) {

        const students = await this.setClassViewers(classId, userName, userRole);

        await DBConnection.query(
            `INSERT INTO class_views (class_id, year, month, views, students) 
            VALUES (?, YEAR(NOW()), MONTH(NOW()), 1, ?)
            ON DUPLICATE KEY UPDATE views = views + 1, students = ?;`,
            [classId, students, students]
        )
    }
}