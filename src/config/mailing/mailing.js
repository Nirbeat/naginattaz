import nodemailer from 'nodemailer';
import { environment } from '../env.js';


export const transport = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: environment.mailing.nagimail,
        pass: environment.mailing.nagipass
    },
    tls: {
        ciphers: 'SSLv3',
    }
});

// service: "gmail",
// port: 587,
// auth: {
//     user: "maximilianomartindev@gmail.com",
//     pass: "hczx owcr xlyd vscx"
// }

export async function welcomeMessage(userMail) {

    const mail = await transport.sendMail({
        from: environment.mailing.nagimail,
        to: userMail,
        subject: "¡Bienvenido a Naginattaz!",
        // considerar usar handlebars para plantillas
        html: `<h1>GRACIAS POR SUMARTE A NAGINATTAZ</h1>
        <p>Te invitamos a que pases por nuestro store para conocer sobre nuestros productos <br>
        También puedes obtener tu Naginatta de Diamante para acceder a todo el contenido más beneficios premium</p>`,
    });
}

export async function suscriptionMessage(user) {

    const date = {
        day: new Date().getDate(),
        month: new Date().getMonth() +2
    }
    transport.sendMail({
        from: environment.mailing.nagimail,
        to: user.email,
        subject: "Suscripción a Naginattaz",
        html: `🔁 No pierdas tu lugar en Naginattaz


Hola ${user.name}, 

Tu membresía en Naginattaz sigue activa y queremos asegurarnos de que no pierdas tu lugar en la comunidad💥

No olvides sumarte al grupo de WhatsApp especial para miembros https://chat.whatsapp.com/BUcAiWCkFiaEAhTmm8e4nk?mode=r_t

Para mantener tu cupo, tu progreso y el acceso completo a nuestras clases, solo tenés que abonar tu suscripción mensual desde este link:

👉 https://naginattaz.com/api/payment/suscription

📅 Fecha límite de pago: ${new Date().getDate()}/${new Date().getMonth() +2}/${new Date().getFullYear()}

Si ya realizaste el pago, podés ignorar este mensaje.
Pero si todavía no lo hiciste, ¡no te duermas! Que queremos seguir bailando con vos.

Gracias por ser parte de esta comunidad que crece con ritmo y pasión 💜

Nos vemos en clase,
Equipo Naginattaz
`
    })
}