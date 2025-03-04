import passport from "passport";
import { environment } from "./env.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { UserDao } from "../database/DAO/UserDAO.js";
import { extractJWTFromCookies } from "./jwt.js";
import { UserDTO } from "../database/DTO/UserDTO.js";

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
                const [ownedCoursesAndLessons] = await new UserDao().getOwnedCourses(user.email)
                user.ownedCoursesAndLessons = ownedCoursesAndLessons;
                done(null, user);
            }
        }
    ));

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([extractJWTFromCookies]),
        secretOrKey: environment.JWTSecret
    },
        async (jwt_payload, done) => {

            const user = await new UserDTO().userJWT(jwt_payload)
            return done(null, user)
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