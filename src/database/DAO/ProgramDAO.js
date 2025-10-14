import { DBConnection } from "../database.js";

export class ProgramDAO {
    async getAllPrograms() {
        const programs = await DBConnection.query(
            'SELECT * FROM programs'
        );

        return programs;
    }

    async getAllPhasesByProgramId(programId) {
        const [phases] = await DBConnection.query(
            `SELECT * FROM program_phases WHERE program_id = ${programId}`
        );

        return phases;
    }

    async getAllModulesByPhaseId(phaseId) {
        const [modules] = await DBConnection.query(
            `SELECT * FROM program_modules WHERE phase_id = ${phaseId}`
        );

        return modules;
    }
    async getProgramWithPhasesAndModules(programId) {
        const [rows] = await DBConnection.query(
            `SELECT 
                p.id AS program_id,
                p.program_name,
                pp.id AS phase_id,
                pp.phase_name,
                pm.id AS module_id,
                pm.module_name,
                c.id AS class_id,
                c.class_name,
                c.class_level,
                c.class_price,
                c.class_image,
                c.genre,
                c.teachers_id,
                l.id AS lesson_id,
                l.name AS lesson_name,
                l.lesson_url
            FROM programs p
            LEFT JOIN program_phases pp ON p.id = pp.program_id
            LEFT JOIN program_modules pm ON pp.id = pm.phase_id
            LEFT JOIN classes c ON pm.id = c.program_module_id
            LEFT JOIN lessons l ON c.id = l.class_id
            WHERE p.id = ?;`,
            [programId]
        );

        const program = {
            program_id: null,
            program_name: null,
            phases: {},
            pdf: 'https://drive.google.com/file/d/1qzN656hyjlyYgoXDmw-iEQv4wWElgv9s/view'
        };

        rows.forEach(row => {
            if (!program.program_id) {
                program.program_id = row.program_id;
                program.program_name = row.program_name;
            }

            if (!program.phases[row.phase_id]) {
                program.phases[row.phase_id] = {
                    phase_id: row.phase_id,
                    phase_name: row.phase_name,
                    modules: {}
                };
            }

            if (!program.phases[row.phase_id].modules[row.module_id]) {
                program.phases[row.phase_id].modules[row.module_id] = {
                    module_id: row.module_id,
                    module_name: row.module_name,
                    classes: {}
                };
            }

            if (!program.phases[row.phase_id].modules[row.module_id].classes[row.class_id]) {
                program.phases[row.phase_id].modules[row.module_id].classes[row.class_id] = {
                    class_id: row.class_id,
                    class_name: row.class_name,
                    class_level: row.class_level,
                    class_price: row.class_price,
                    class_image: row.class_image,
                    genre: row.genre,
                    teachers_id: row.teachers_id,
                    lessons: []
                };
            }

            if (row.lesson_id) {
                program.phases[row.phase_id].modules[row.module_id].classes[row.class_id].lessons.push({
                    lesson_id: row.lesson_id,
                    lesson_name: row.lesson_name,
                    lesson_url: row.lesson_url
                });
            }
        });

        // todo a array
        Object.keys(program.phases).forEach(phaseId => {
            Object.keys(program.phases[phaseId].modules).forEach(moduleId => {
                program.phases[phaseId].modules[moduleId].classes = Object.values(program.phases[phaseId].modules[moduleId].classes);
            });
            program.phases[phaseId].modules = Object.values(program.phases[phaseId].modules);
        });
        program.phases = Object.values(program.phases);

        return program;
    }

}