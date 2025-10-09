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

        // Estructurar datos
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

// new ProgramDAO().getProgramWithPhasesAndModules(1).then(data=> console.log(data.phases))

// {
//     program_id: 1,
//         program_name: "A Technique Ride",
//             phases: 
//             [
//                 {
//                     "phase_id": 1,
//                     "phase_name": "1. Bases fundamentales",
//                     "modules": [
//                         {
//                             "module_id": 1,
//                             "module_name": "1. Módulo 1: Cuerpo 360. Conciencia corporal y alineación",
//                             "classes": [
//                                 {
//                                     "class_id": 15,
//                                     "class_name": "2. Patrones de movimiento",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[19]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 80,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1067912475"
//                                         },
//                                         {
//                                             "lesson_id": 81,
//                                             "lesson_name": "2. Patrón 1 (explicación)",
//                                             "lesson_url": "1067912437"
//                                         },
//                                         {
//                                             "lesson_id": 82,
//                                             "lesson_name": "3. Patrón 1 (pasada seguida)",
//                                             "lesson_url": "1067912485"
//                                         },
//                                         {
//                                             "lesson_id": 83,
//                                             "lesson_name": "4. Patrón 2 (explicación)",
//                                             "lesson_url": "1067912447"
//                                         },
//                                         {
//                                             "lesson_id": 84,
//                                             "lesson_name": "5. Patrón 2 (pasada seguida)",
//                                             "lesson_url": "1067912424"
//                                         },
//                                         {
//                                             "lesson_id": 85,
//                                             "lesson_name": "6. Cierre",
//                                             "lesson_url": "1067912462"
//                                         }
//                                     ]
//                                 }
//                             ]
//                         },
//                         {
//                             "module_id": 2,
//                             "module_name": "2. Módulo 2: Groove, postura y lenguaje específico",
//                             "classes": [
//                                 {
//                                     "class_id": 16,
//                                     "class_name": "1. Bases del Hip-hop: Bounce",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[2]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 86,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1055983348"
//                                         },
//                                         {
//                                             "lesson_id": 87,
//                                             "lesson_name": "2. Parte 1: Noción básica del concepto de “bounce”. Mecánica del movimiento.  Incorporación de pisadas.",
//                                             "lesson_url": "1056017263"
//                                         },
//                                         {
//                                             "lesson_id": 88,
//                                             "lesson_name": "3. Parte 2: Demostración & Ejemplos.",
//                                             "lesson_url": "1056574445"
//                                         },
//                                         {
//                                             "lesson_id": 89,
//                                             "lesson_name": "4. Cierre",
//                                             "lesson_url": "1065964961"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 17,
//                                     "class_name": "2. Bases del Hip Hop: Body Rock",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[2]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 90,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1065968645"
//                                         },
//                                         {
//                                             "lesson_id": 91,
//                                             "lesson_name": "2. Bloque 1:  Noción básica del concepto de “body rock”. Mecánica del movimiento. Acentuación. Incorporación de pisadas. Ejercicio. ",
//                                             "lesson_url": null
//                                         },
//                                         {
//                                             "lesson_id": 92,
//                                             "lesson_name": "3. Bloque 2: Continuación. Cambio de acentuación. Incorporación de pisadas. Ejercicio. ",
//                                             "lesson_url": "1065968684"
//                                         },
//                                         {
//                                             "lesson_id": 93,
//                                             "lesson_name": "4. Cierre",
//                                             "lesson_url": "1065968713"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 18,
//                                     "class_name": "3. Hip Hop Fundamentos (parte 1)",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[18]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 94,
//                                             "lesson_name": "1. Introducción\r\n",
//                                             "lesson_url": "1067918216"
//                                         },
//                                         {
//                                             "lesson_id": 95,
//                                             "lesson_name": "2. Bounce: Perspectiva Integral ",
//                                             "lesson_url": "1067918156"
//                                         },
//                                         {
//                                             "lesson_id": 96,
//                                             "lesson_name": "3. Aplicación y Ejercicios",
//                                             "lesson_url": "1067928815"
//                                         },
//                                         {
//                                             "lesson_id": 97,
//                                             "lesson_name": "4. Estructuras de piernas + bounce",
//                                             "lesson_url": "1067918144"
//                                         },
//                                         {
//                                             "lesson_id": 98,
//                                             "lesson_name": "5. Cierre",
//                                             "lesson_url": "1067918174"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 19,
//                                     "class_name": "4. Hip Hop Fundamentos (parte 2)",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[18]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 99,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1067931241"
//                                         },
//                                         {
//                                             "lesson_id": 100,
//                                             "lesson_name": "2. Rocking: Perspectiva Integral",
//                                             "lesson_url": "1067931253"
//                                         },
//                                         {
//                                             "lesson_id": 101,
//                                             "lesson_name": "3. Aplicación y Ejercicios",
//                                             "lesson_url": "1067931194"
//                                         },
//                                         {
//                                             "lesson_id": 102,
//                                             "lesson_name": "4. Cierre",
//                                             "lesson_url": "1067931253"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 20,
//                                     "class_name": "5.  Bases del House: Desde el Groove",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[8]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 103,
//                                             "lesson_name": "1. Introducción ",
//                                             "lesson_url": "1065971379"
//                                         },
//                                         {
//                                             "lesson_id": 104,
//                                             "lesson_name": "2. Bloque 1: Noción inicial del groove en el House Dance. Concepto de “Jaackin”.",
//                                             "lesson_url": "1065971401"
//                                         },
//                                         {
//                                             "lesson_id": 105,
//                                             "lesson_name": "3. Bloque 2: Desestructurar el concepto.",
//                                             "lesson_url": "1065971421"
//                                         },
//                                         {
//                                             "lesson_id": 106,
//                                             "lesson_name": "4. Cierre",
//                                             "lesson_url": "1065971439"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 21,
//                                     "class_name": "6. Bases del House: Trabajo de la pisada",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[8]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 107,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1065972064"
//                                         },
//                                         {
//                                             "lesson_id": 108,
//                                             "lesson_name": "2. Bloque 1: Consciencia de la cadera. Incorporación del bounce. Nexo con la pisada. Direcciones, frentes y cruces",
//                                             "lesson_url": "1065972087"
//                                         },
//                                         {
//                                             "lesson_id": 109,
//                                             "lesson_name": "3. Bloque 2: Desplazamientos. Suspensión. Cambio de apoyos.",
//                                             "lesson_url": "1065972100"
//                                         },
//                                         {
//                                             "lesson_id": 110,
//                                             "lesson_name": "4. Bloque 3: Niveles. Variación de dinámicas.",
//                                             "lesson_url": "1065972115"
//                                         },
//                                         {
//                                             "lesson_id": 111,
//                                             "lesson_name": "5. Cierre\r\n",
//                                             "lesson_url": "1065972141"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 22,
//                                     "class_name": "7. Dancehall Basics: Posturas y Escuelas",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[4]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 112,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1067935474"
//                                         },
//                                         {
//                                             "lesson_id": 113,
//                                             "lesson_name": "2. Postura & Ejercicios",
//                                             "lesson_url": "1067935494"
//                                         },
//                                         {
//                                             "lesson_id": 114,
//                                             "lesson_name": "3. Bloque 1: Old School. Pasos Básicos: Hottie Hottie & World Dance",
//                                             "lesson_url": "1067935461"
//                                         },
//                                         {
//                                             "lesson_id": 115,
//                                             "lesson_name": "4. Bloque 2: Middle School. Pasos Básicos: Row Di Boat & Around Di Word\r\n",
//                                             "lesson_url": "1067935666"
//                                         },
//                                         {
//                                             "lesson_id": 116,
//                                             "lesson_name": "5. Bloque 3: New School. Pasos Básicos: Walk & New Rave",
//                                             "lesson_url": "1067935641"
//                                         },
//                                         {
//                                             "lesson_id": 117,
//                                             "lesson_name": "6. Cierre",
//                                             "lesson_url": "1067935511"
//                                         }
//                                     ]
//                                 }
//                             ]
//                         },
//                         {
//                             "module_id": 3,
//                             "module_name": "3. Módulo 3: Footwork básico",
//                             "classes": [
//                                 {
//                                     "class_id": 23,
//                                     "class_name": "1. Precisión en el footwork: Punta-Talón y Pivots en desde el House \r\n",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[8]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 118,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066564675"
//                                         },
//                                         {
//                                             "lesson_id": 119,
//                                             "lesson_name": "2. Bloque 1: Punta-Talón (Noción inicial)",
//                                             "lesson_url": "1066564696"
//                                         },
//                                         {
//                                             "lesson_id": 120,
//                                             "lesson_name": "3. Bloque 2: Punta-Talón (Direcciones)",
//                                             "lesson_url": "1066564482"
//                                         },
//                                         {
//                                             "lesson_id": 121,
//                                             "lesson_name": "4. Bloque 3: Pivots",
//                                             "lesson_url": "1066564557"
//                                         },
//                                         {
//                                             "lesson_id": 122,
//                                             "lesson_name": "5. Bloque 4: Pivots & Suspensión",
//                                             "lesson_url": "1066564610"
//                                         },
//                                         {
//                                             "lesson_id": 123,
//                                             "lesson_name": "6. Bloque 5: Uso de la cadera & Recomendaciones",
//                                             "lesson_url": "1066564634"
//                                         },
//                                         {
//                                             "lesson_id": 124,
//                                             "lesson_name": "7. Cierre",
//                                             "lesson_url": "1066564464"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 24,
//                                     "class_name": "2. Flow & Glide: Explorando los Slides desde el House",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[8]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 125,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066566949"
//                                         },
//                                         {
//                                             "lesson_id": 126,
//                                             "lesson_name": "2. Slides: Conciencia de los apoyos y el traspaso del peso. Empuje y tracción. Direcciones y espacialidad. Ejercicios.",
//                                             "lesson_url": null
//                                         },
//                                         {
//                                             "lesson_id": 127,
//                                             "lesson_name": "3. Cierre",
//                                             "lesson_url": "1066566899"
//                                         }
//                                     ]
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "phase_id": 2,
//                     "phase_name": "2. Vocabulario y técnica",
//                     "modules": [
//                         {
//                             "module_id": 4,
//                             "module_name": "1. Módulo 1: Pasos básicos y vocabulario",
//                             "classes": [
//                                 {
//                                     "class_id": 25,
//                                     "class_name": "1. House Dance Basics: Swirl & Train",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[8]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 128,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066571908"
//                                         },
//                                         {
//                                             "lesson_id": 129,
//                                             "lesson_name": "2. Bloque 1 / Paso 1: Swirl",
//                                             "lesson_url": "1066571926"
//                                         },
//                                         {
//                                             "lesson_id": 130,
//                                             "lesson_name": "3. Bloque 2 / Paso 2: Train",
//                                             "lesson_url": "1066571862"
//                                         },
//                                         {
//                                             "lesson_id": 131,
//                                             "lesson_name": "4.Cierre",
//                                             "lesson_url": "1066571879"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 26,
//                                     "class_name": "2. House Dance Basics: Heel Step",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[8]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 132,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066574653"
//                                         },
//                                         {
//                                             "lesson_id": 133,
//                                             "lesson_name": "2. Bloque 1: Heel Step",
//                                             "lesson_url": "1066574485"
//                                         },
//                                         {
//                                             "lesson_id": 134,
//                                             "lesson_name": "3. Bloque 2: Variaciones del paso",
//                                             "lesson_url": "1066574599"
//                                         },
//                                         {
//                                             "lesson_id": 135,
//                                             "lesson_name": "4. Bloque 3: Secuencia integradora",
//                                             "lesson_url": "1066574515"
//                                         },
//                                         {
//                                             "lesson_id": 136,
//                                             "lesson_name": "5. Cierre",
//                                             "lesson_url": "1066574580"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 27,
//                                     "class_name": "3. House Dance Basics: Chase & Loose Legs",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[8]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 137,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066573487"
//                                         },
//                                         {
//                                             "lesson_id": 138,
//                                             "lesson_name": "2. Bloque 1: Chase",
//                                             "lesson_url": "1066573444"
//                                         },
//                                         {
//                                             "lesson_id": 139,
//                                             "lesson_name": "3. Bloque 2: De Chase a Loose Legs",
//                                             "lesson_url": "1066573444"
//                                         },
//                                         {
//                                             "lesson_id": 140,
//                                             "lesson_name": "4. Cierre",
//                                             "lesson_url": "1066573544"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 28,
//                                     "class_name": "4. House Dance Basics: Shuffle",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[87]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 141,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066575181"
//                                         },
//                                         {
//                                             "lesson_id": 142,
//                                             "lesson_name": "2. Bloque 1: Shuffle \r\n",
//                                             "lesson_url": "1066575204"
//                                         },
//                                         {
//                                             "lesson_id": 143,
//                                             "lesson_name": "3. Cierre",
//                                             "lesson_url": "1066575256"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 29,
//                                     "class_name": "5. Pasos Sociales en el Trap",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[7]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 144,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": null
//                                         },
//                                         {
//                                             "lesson_id": 145,
//                                             "lesson_name": "2. Bloque 1: Lean, Nae-Nae, Juju on the Beat & Hit the Quan",
//                                             "lesson_url": null
//                                         },
//                                         {
//                                             "lesson_id": 146,
//                                             "lesson_name": "3. Bloque 1: Completo",
//                                             "lesson_url": null
//                                         },
//                                         {
//                                             "lesson_id": 147,
//                                             "lesson_name": "4. Bloque 2 / Paso 1: Milly Rock",
//                                             "lesson_url": null
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 30,
//                                     "class_name": "6.  Hip Hop: Pasos Sociales",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[2]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 148,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": null
//                                         },
//                                         {
//                                             "lesson_id": 149,
//                                             "lesson_name": "2. Bloque 1: Shamrock & The Wop",
//                                             "lesson_url": "1051982398"
//                                         },
//                                         {
//                                             "lesson_id": 150,
//                                             "lesson_name": "3. Bloque 2: ATL Stomp & The Fila",
//                                             "lesson_url": "1052076250"
//                                         },
//                                         {
//                                             "lesson_id": 151,
//                                             "lesson_name": "4. Drill con Música",
//                                             "lesson_url": "1052130296"
//                                         },
//                                         {
//                                             "lesson_id": 152,
//                                             "lesson_name": "5. Sum Up & Cierre",
//                                             "lesson_url": "1052136169"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 31,
//                                     "class_name": "7.  Hip Hop: Estructuras Rítmicas en Pasos Sociales",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[11]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 153,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066602079"
//                                         },
//                                         {
//                                             "lesson_id": 154,
//                                             "lesson_name": "2. Bloque 1: Estructuras (Tiempos impares, Pulso, Tiempo 5)",
//                                             "lesson_url": "1066602171"
//                                         },
//                                         {
//                                             "lesson_id": 155,
//                                             "lesson_name": "3. Bloque 2: Pasos Sociales (Shamrock & Snake)",
//                                             "lesson_url": "1066602144"
//                                         },
//                                         {
//                                             "lesson_id": 156,
//                                             "lesson_name": "4. Bloque 3: Pasos Sociales (Pepper Seed & Dippin’)",
//                                             "lesson_url": "1066602052"
//                                         },
//                                         {
//                                             "lesson_id": 157,
//                                             "lesson_name": "5. Demostración & Ejemplos",
//                                             "lesson_url": "1066602123"
//                                         },
//                                         {
//                                             "lesson_id": 158,
//                                             "lesson_name": "6. Cierre",
//                                             "lesson_url": "1066602188"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 32,
//                                     "class_name": "8. Dancehall Energies: Smooth",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[12]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 159,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066616359"
//                                         },
//                                         {
//                                             "lesson_id": 160,
//                                             "lesson_name": "2. Bloque 1: Uso del Torso",
//                                             "lesson_url": "1066616417"
//                                         },
//                                         {
//                                             "lesson_id": 161,
//                                             "lesson_name": "3. Bloque 2 / Paso 1: I Choose You by Kriptic Klique",
//                                             "lesson_url": "1066616490"
//                                         },
//                                         {
//                                             "lesson_id": 162,
//                                             "lesson_name": "4. Bloque 3 / Paso 2: Into You by Extreme Pushers",
//                                             "lesson_url": "1066616473"
//                                         },
//                                         {
//                                             "lesson_id": 163,
//                                             "lesson_name": "5. Bloque 4 / Paso 3: Good Mood by Crazy Shellingz",
//                                             "lesson_url": "1066616392"
//                                         },
//                                         {
//                                             "lesson_id": 164,
//                                             "lesson_name": "6. Cierre",
//                                             "lesson_url": "1066616456"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 33,
//                                     "class_name": "9. Dancehall Energies: Badman",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[12]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 165,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066618721"
//                                         },
//                                         {
//                                             "lesson_id": 166,
//                                             "lesson_name": "2. Bloque 1: Uso de los Brazos",
//                                             "lesson_url": "1066618682"
//                                         },
//                                         {
//                                             "lesson_id": 167,
//                                             "lesson_name": "3. Bloque 2 / Paso 1: Shoot & Gwaan by Supreme Blazzaz\r\n",
//                                             "lesson_url": "1066618659"
//                                         },
//                                         {
//                                             "lesson_id": 168,
//                                             "lesson_name": "4. Bloque 3 / Paso 2: Real Gunman by Overload Skankaz",
//                                             "lesson_url": "1066618633"
//                                         },
//                                         {
//                                             "lesson_id": 169,
//                                             "lesson_name": "5. Bloque 4 / Paso 3: God of War by Overload Skankaz",
//                                             "lesson_url": "1066618525"
//                                         },
//                                         {
//                                             "lesson_id": 170,
//                                             "lesson_name": "6. Cierre",
//                                             "lesson_url": "1066618580"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 34,
//                                     "class_name": "10. Dancehall Energies: Female",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[4]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 171,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066642877"
//                                         },
//                                         {
//                                             "lesson_id": 172,
//                                             "lesson_name": "2. Bloque 1 / Giros & Círculos: Wine & Gogo Wine",
//                                             "lesson_url": "1066642779"
//                                         },
//                                         {
//                                             "lesson_id": 173,
//                                             "lesson_name": "3. Bloque 2 / Trabar: Tic Toc, Sticky Wine & Shook",
//                                             "lesson_url": "1066642915"
//                                         },
//                                         {
//                                             "lesson_id": 174,
//                                             "lesson_name": "4. Bloque 3 / Romper: Unch It",
//                                             "lesson_url": "1066642808"
//                                         },
//                                         {
//                                             "lesson_id": 175,
//                                             "lesson_name": "5. Bloque 4 / Shakes: Puppy Tail & Bubble",
//                                             "lesson_url": "1066642842"
//                                         },
//                                         {
//                                             "lesson_id": 176,
//                                             "lesson_name": "6. Cierre",
//                                             "lesson_url": "1066642895"
//                                         }
//                                     ]
//                                 }
//                             ]
//                         },
//                         {
//                             "module_id": 5,
//                             "module_name": "2. Módulo 2: Proyección del movimiento y performance",
//                             "classes": [
//                                 {
//                                     "class_id": 35,
//                                     "class_name": "1. Waacking Basics: Whacks, Overhead & Rolls",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[21]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 177,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1068150859"
//                                         },
//                                         {
//                                             "lesson_id": 178,
//                                             "lesson_name": "2. Entrada en calor / Técnica 1: Whacks",
//                                             "lesson_url": "1068150907"
//                                         },
//                                         {
//                                             "lesson_id": 179,
//                                             "lesson_name": "3. Técnica 2 y 3: Overhead & Líneas",
//                                             "lesson_url": "1068150843"
//                                         },
//                                         {
//                                             "lesson_id": 180,
//                                             "lesson_name": "4. Ejercicio de coordinación",
//                                             "lesson_url": "1068150885"
//                                         },
//                                         {
//                                             "lesson_id": 181,
//                                             "lesson_name": "5. Cierre",
//                                             "lesson_url": "1068150821"
//                                         }
//                                     ]
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "phase_id": 3,
//                     "phase_name": "3. Integración y aplicación",
//                     "modules": [
//                         {
//                             "module_id": 6,
//                             "module_name": "1. Módulo 1: Coreografía",
//                             "classes": [
//                                 {
//                                     "class_id": 36,
//                                     "class_name": "1. Gaaassss - Mistress Of Rap",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[9]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 182,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066647883"
//                                         },
//                                         {
//                                             "lesson_id": 183,
//                                             "lesson_name": "2. Explicación (Parte 1) & Pasada con Música",
//                                             "lesson_url": "1066647819"
//                                         },
//                                         {
//                                             "lesson_id": 184,
//                                             "lesson_name": "3. Explicación (Parte 2) & Pasada Completa (Con Música)",
//                                             "lesson_url": "1066647858"
//                                         },
//                                         {
//                                             "lesson_id": 185,
//                                             "lesson_name": "4. Cierre",
//                                             "lesson_url": "1066647792"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 37,
//                                     "class_name": "2. Vossi Bop",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[2]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 186,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1068200501"
//                                         },
//                                         {
//                                             "lesson_id": 187,
//                                             "lesson_name": "2. Explicación (Parte 1)",
//                                             "lesson_url": "1068200450"
//                                         },
//                                         {
//                                             "lesson_id": 188,
//                                             "lesson_name": "3. Pasada con música (Parte 1)",
//                                             "lesson_url": "1068200525"
//                                         },
//                                         {
//                                             "lesson_id": 189,
//                                             "lesson_name": "4. Explicación (Parte 2)",
//                                             "lesson_url": "1068200436"
//                                         },
//                                         {
//                                             "lesson_id": 190,
//                                             "lesson_name": "5. Pasada con música (Parte 2)",
//                                             "lesson_url": "1068200478"
//                                         },
//                                         {
//                                             "lesson_id": 191,
//                                             "lesson_name": "6. Pasada con música (Coreo Completa)",
//                                             "lesson_url": "1068200552"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 38,
//                                     "class_name": "3. New Dorp - New York",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[2]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 192,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066651298"
//                                         },
//                                         {
//                                             "lesson_id": 193,
//                                             "lesson_name": "2. Explicación (Parte 1)",
//                                             "lesson_url": "1066651458"
//                                         },
//                                         {
//                                             "lesson_id": 194,
//                                             "lesson_name": "3. Pasada con Música (Parte 1)",
//                                             "lesson_url": "1066651317"
//                                         },
//                                         {
//                                             "lesson_id": 195,
//                                             "lesson_name": "4. Explicación (Parte 2)",
//                                             "lesson_url": "1066651384"
//                                         },
//                                         {
//                                             "lesson_id": 196,
//                                             "lesson_name": "5. Pasada con Música (Parte 2)",
//                                             "lesson_url": "1066651418"
//                                         },
//                                         {
//                                             "lesson_id": 197,
//                                             "lesson_name": "6. Pasada con Música (Coreo Completa)",
//                                             "lesson_url": "1066651367"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 39,
//                                     "class_name": "4. So Disrespectful",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[2]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 198,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1068206062"
//                                         },
//                                         {
//                                             "lesson_id": 199,
//                                             "lesson_name": "2. Explicación (Parte 1)",
//                                             "lesson_url": "1068206294"
//                                         },
//                                         {
//                                             "lesson_id": 200,
//                                             "lesson_name": "3. Pasada con Música (Parte 1)",
//                                             "lesson_url": "1068206127"
//                                         },
//                                         {
//                                             "lesson_id": 201,
//                                             "lesson_name": "4. Explicación (Parte 2)",
//                                             "lesson_url": "1068206324"
//                                         },
//                                         {
//                                             "lesson_id": 202,
//                                             "lesson_name": "5. Pasada con Música (Parte 2)",
//                                             "lesson_url": "1068206275"
//                                         },
//                                         {
//                                             "lesson_id": 203,
//                                             "lesson_name": "6. Pasada con Música (Coreo Completa)",
//                                             "lesson_url": "1068206223"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 40,
//                                     "class_name": "5. Unch It",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[4]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 204,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1068209091"
//                                         },
//                                         {
//                                             "lesson_id": 205,
//                                             "lesson_name": "2. Explicación & Pasada con Música (Parte 1)",
//                                             "lesson_url": "1068209046"
//                                         },
//                                         {
//                                             "lesson_id": 206,
//                                             "lesson_name": "3. Explicación & Pasada con Música (Parte 2)",
//                                             "lesson_url": "1068209158"
//                                         },
//                                         {
//                                             "lesson_id": 207,
//                                             "lesson_name": "4. Pasada con Música (Coreo Completa)",
//                                             "lesson_url": "1068209128"
//                                         },
//                                         {
//                                             "lesson_id": 208,
//                                             "lesson_name": "5. Cierre",
//                                             "lesson_url": "1068209065"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 41,
//                                     "class_name": "6. Way Bigger",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[10]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 209,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1066649507"
//                                         },
//                                         {
//                                             "lesson_id": 210,
//                                             "lesson_name": "2. Explicación (Parte 1)",
//                                             "lesson_url": "1066649548"
//                                         },
//                                         {
//                                             "lesson_id": 211,
//                                             "lesson_name": "3. Pasada con Música (Parte 1)",
//                                             "lesson_url": "1066649660"
//                                         },
//                                         {
//                                             "lesson_id": 212,
//                                             "lesson_name": "4. Explicación (Parte 2)",
//                                             "lesson_url": "1066649585"
//                                         },
//                                         {
//                                             "lesson_id": 213,
//                                             "lesson_name": "5. Pasada con Música (Coreo Completa)",
//                                             "lesson_url": "1066649528"
//                                         },
//                                         {
//                                             "lesson_id": 214,
//                                             "lesson_name": "6. Cierre",
//                                             "lesson_url": "1066649640"
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "class_id": 42,
//                                     "class_name": "7. Wannabe",
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": "",
//                                     "genre": "",
//                                     "teachers_id": "[6]",
//                                     "lessons": [
//                                         {
//                                             "lesson_id": 215,
//                                             "lesson_name": "1. Introducción",
//                                             "lesson_url": "1053474473"
//                                         },
//                                         {
//                                             "lesson_id": 216,
//                                             "lesson_name": "2. Explicación (Parte 1)",
//                                             "lesson_url": "1053486064"
//                                         },
//                                         {
//                                             "lesson_id": 217,
//                                             "lesson_name": "3. Explicación (Parte 2)",
//                                             "lesson_url": "1053817921"
//                                         },
//                                         {
//                                             "lesson_id": 218,
//                                             "lesson_name": "4. Pasada con Música (Coreo Completa)",
//                                             "lesson_url": "1053581201"
//                                         },
//                                         {
//                                             "lesson_id": 219,
//                                             "lesson_name": "5. Cierre",
//                                             "lesson_url": "1053606116"
//                                         }
//                                     ]
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "phase_id": 4,
//                     "phase_name": "4. Proyecto final",
//                     "modules": [
//                         {
//                             "module_id": 7,
//                             "module_name": "1. Módulo 1: Preparación para la coreografía y la improvisación",
//                             "classes": [
//                                 {
//                                     "class_id": null,
//                                     "class_name": null,
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": null,
//                                     "genre": null,
//                                     "teachers_id": null,
//                                     "lessons": []
//                                 }
//                             ]
//                         },
//                         {
//                             "module_id": 8,
//                             "module_name": "2. Módulo 2: Trabajo final",
//                             "classes": [
//                                 {
//                                     "class_id": null,
//                                     "class_name": null,
//                                     "class_level": null,
//                                     "class_price": null,
//                                     "class_image": null,
//                                     "genre": null,
//                                     "teachers_id": null,
//                                     "lessons": []
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
// }