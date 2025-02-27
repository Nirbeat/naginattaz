import { serverRoot } from './config/utils.js';
import express from 'express';
import { environment } from './config/env.js';
import { DBConnection } from './database/database.js';
import passport from 'passport';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.routes.js';
import coursesRouter from './routes/api/courses.routes.js';
import sessionsRouter from './routes/api/sessions.routes.js'

import authRouter from './routes/api/auth.routes.js' 
import initializePassport from './config/passport.js';
import cookieParser from 'cookie-parser';

const app = express();

app.engine('handlebars', handlebars.engine({partialsDir: serverRoot + '/views/partials'}));
app.set('view engine', 'handlebars');
app.set('views',serverRoot + '/views');

app.use(passport.initialize());
app.use(cookieParser());
initializePassport();

app.use(express.static(serverRoot + '/public'));

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/sessions', sessionsRouter);
app.use(viewsRouter);


app.listen(environment.serverPort, async ()=>{
    (await DBConnection).connect()
    .then(()=> console.log("database connected"))
    .catch((e)=> console.log(e.message) )
});