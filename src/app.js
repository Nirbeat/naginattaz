import { serverRoot } from './config/utils.js';
import express from 'express';
import { environment } from './config/env.js';
import { DBConnection } from './database/database.js';
import passport from 'passport';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.routes.js';
import sessionsRouter from './routes/api/sessions.routes.js'
import paymentsRouter from './routes/api/payment.routes.js'
import "./config/mailing/mailing.js";
import authRouter from './routes/api/auth.routes.js' 
import initializePassport from './config/passport.js';
import cookieParser from 'cookie-parser';

const app = express();

app.engine('handlebars', handlebars.engine({partialsDir: serverRoot + '/views/partials'}));
app.set('view engine', 'handlebars');
app.set('views',serverRoot + '/views');

app.use(passport.initialize());
app.use(cookieParser(environment.cookieParser));
initializePassport();

app.use(express.static(serverRoot + '/public'));
app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'];
    if (userAgent.includes('Instagram')) {
        res.send(`<ul>
            Estás usando el navegador de Instagram. <br>
            Para acceder correctamente al sitio, sigue estas instrucciones: <br>
            <li>Haz click en los tres puntos que aparecen arriba a la derecha de tu pantalla</li>
            <li>Elige la opción "Copiar enlace"</li>
            <li>Abre tu navegador de preferencia</li>
            <li>Pega el enlace</li>
            <li>Disfruta de Naginattaz :)</li>
            </ul>`);
    } else {
        next();
    }
});

app.use('/api/sessions', sessionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentsRouter);
app.use(viewsRouter);


app.listen(environment.serverPort, async ()=>{
    (await DBConnection).connect()
    .then(()=> console.log("database connected"))
    .catch((e)=> console.log(e.message) )
});