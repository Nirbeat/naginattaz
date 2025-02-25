import passport from "passport";
import { environment } from "./env.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { UserDao } from "../database/DAO/UserDAO.js";
import { extractJWTFromCookies } from "./jwt.js";

function initializePassport() {

    passport.use(new GoogleStrategy({
        clientID: environment.googleAuth.clientID,
        clientSecret: environment.googleAuth.secret,
        callbackURL: "http://localhost:8080/api/auth/google-authentication"
    },
        async (accessToken, refreshToken, profile, done) => {

            const userManager = new UserDao();

            let [[user]] = await userManager.getUserByEmail(profile._json.email);
            if (user == '') {
                user = await userManager.addUser({
                    email: profile._json.email,
                    name: profile._json.name,
                    profileImageURL: profile._json.picture
                });
                done(null, user);
            }
            else {
                done(null, user);
            }
        }
    ));

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([extractJWTFromCookies]),
        secretOrKey: environment.JWTSecret
    },
        async (jwt_payload, done) => {
            return done(null, jwt_payload)
        }))


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (email, done) => {
        let user = await new UserDao().getUserByEmail(email);
        done(null, user);
    })
}

export default initializePassport;

// {
//     id: '111457841853729183187',
//     displayName: 'Maximiliano Martin',
//     name: { familyName: 'Martin', givenName: 'Maximiliano' },
//     emails: [ { value: 'maxinirbeat@gmail.com', verified: true } ],
//     photos: [
//       {
//         value: 'https://lh3.googleusercontent.com/a/ACg8ocLdAoJ8fLtLaI6dbPmWmFBUe1BSYpan8ux_X7vd7bwy-DqGjbg=s96-c'
//       }
//     ],
//     provider: 'google',
//     _raw: '{\n' +
//       '  "sub": "111457841853729183187",\n' +
//       '  "name": "Maximiliano Martin",\n' +
//       '  "given_name": "Maximiliano",\n' +
//       '  "family_name": "Martin",\n' +
//       '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocLdAoJ8fLtLaI6dbPmWmFBUe1BSYpan8ux_X7vd7bwy-DqGjbg\\u003ds96-c",\n' +
//       '  "email": "maxinirbeat@gmail.com",\n' +
//       '  "email_verified": true\n' +
//       '}',
//     _json: {
//       sub: '111457841853729183187',
//       name: 'Maximiliano Martin',
//       given_name: 'Maximiliano',
//       family_name: 'Martin',
//       picture: 'https://lh3.googleusercontent.com/a/ACg8ocLdAoJ8fLtLaI6dbPmWmFBUe1BSYpan8ux_X7vd7bwy-DqGjbg=s96-c',
//       email: 'maxinirbeat@gmail.com',
//       email_verified: true
//     }
//   }