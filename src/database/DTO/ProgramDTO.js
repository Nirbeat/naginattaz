import { ProgramDAO } from "../DAO/ProgramDAO.js";

export class ProgramDTO{

    async setProgramCardLink(programId){
        const programData = await new ProgramDAO().getProgramWithPhasesAndModules(programId);
        const phaseId = programData.phases[0].phase_id;
        const moduleId = programData.phases[0].modules[0].module_id;
        const classId = programData.phases[0].modules[0].classes[0].class_id;
        const lessonId = programData.phases[0].modules[0].classes[0].lessons[0].lesson_id

        return `${programId}/${phaseId}/${moduleId}/${classId}/${lessonId}`
    }
}

