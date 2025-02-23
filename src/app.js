import { serverRoot } from './config/utils.js';
import express from 'express';
import { environment } from './config/env.js';
import { DBConnection } from './database/database.js';
import passport from 'passport';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.routes.js';
import authRouter from './routes/api/auth.routes.js' 
import initializePassport from './config/passport.js';
const app = express();

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views',serverRoot + '/views');

app.use(passport.initialize());
initializePassport();

app.use(express.static(serverRoot + '/public'));

app.use(viewsRouter);
app.use('/api/auth', authRouter);


app.listen(environment.serverPort, async ()=>{
    (await DBConnection).connect()
    .then(()=> console.log("database connected"))
    .catch((e)=> console.log(e.message) )
});