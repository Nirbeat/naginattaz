import nodemailer from 'nodemailer';
import { environment } from '../env.js';


export const transport = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Microsoft usa STARTTLS, no SSL directo
    auth: {
        user: 'soporte@naginattaz.com',
        pass: 'TU_CONTRASEÑA',
    },
    tls: {
        ciphers: 'SSLv3', // Configura el cifrado de la conexión
    },

    // service: "gmail",
    // port: 587,
    // auth: {
    //     user: "maximilianomartindev@gmail.com",
    //     pass: "hczx owcr xlyd vscx"
    // }
});

export async function welcomeMessage(userMail){

    const mail = await transport.sendMail({
        from: environment.mailing.nagimail,
        to: userMail,
        subject: "¡Bienvenido a Naginattaz!",
        // considerar usar handlebars para plantillas
        html: `<h1>GRACIAS POR SUMARTE A NAGINATTAZ</h1>
        <p>Te invitamos a que pases por nuestro store para conocer sobre nuestros productos <br>
        También puedes obtener tu Naginatta de Diamante para acceder a todo el contenido más beneficios premium</p>`,
        

    })
}

export async function suscriptionMessage(userMail, expireData) {
    
}
// transport.sendMail({
//     from: "maximilianomartindev@gmail.com",
//     // from: "maxinirbeat@gmail.com",
//     to: "maxinirbeat@gmail.com",
//     // to: "maximilianomartindev@gmail.com",
//     subject: "abersianda",
//     html: `<h1>abersianda</h1>`
// }).then(data=> console.log(data))