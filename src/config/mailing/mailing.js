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

export async function welcomeMessage(userMail) {

    transport.sendMail({
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

    transport.sendMail({
        from: environment.mailing.nagimail,
        to: user.email,
        subject: "Suscripción a Naginattaz",
        html: `<h3>🔁 No pierdas tu lugar en Naginattaz</h3>


<p>Hola ${user.name},</p><br> 

<p>Tu membresía en Naginattaz sigue activa y queremos asegurarnos de que no pierdas tu lugar en la comunidad💥</p><br>

<p>No olvides sumarte al grupo de WhatsApp especial para miembros https://chat.whatsapp.com/BUcAiWCkFiaEAhTmm8e4nk?mode=r_t</p><br>

<p>Para mantener tu cupo, tu progreso y el acceso completo a nuestras clases, solo tenés que abonar tu suscripción mensual desde este link:<p><br>

<p>👉 https://naginattaz.com/api/payment/suscription</p><br>

<p>📅 Fecha límite de pago: ${new Date().getDate()}/${new Date().getMonth() +2}/${new Date().getFullYear()}</p><br>

<p>Si ya realizaste el pago, podés ignorar este mensaje.<p/>
Pero si todavía no lo hiciste, ¡no te duermas! Que queremos seguir bailando con vos.</p><br>

<p>Gracias por ser parte de esta comunidad que crece con ritmo y pasión 💜</p><br>

<p>Nos vemos en clase,</p>
<p>Equipo Naginattaz</p>
`
    })
}