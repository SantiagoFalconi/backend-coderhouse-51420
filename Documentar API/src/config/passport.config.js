import passport from 'passport'
import local from 'passport-local'
import userModel from '../services/db/dao/models/usersModel.js'
import GitHubStrategy from 'passport-github2'
import { createHash, validatePassword } from '../utils.js'
import sensitiveInfo from './sensitiveInfo.js'
import jwt from 'passport-jwt'
import { default as token } from 'jsonwebtoken'
import { default as MailingService } from '../services/email/mailing.js'

const PRIVATE_KEY = "GecciaKey";
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const { GITHUB_CLIENTID, GITHUB_CLIENTSECRET, GITHUB_CALLBACKURL} = sensitiveInfo;


export const generateToken = user => token.sign({ user }, PRIVATE_KEY, { expiresIn: '1d' })

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ status: "error", error: "Unauthorized" })
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        console.log(error);
        if (error) return res.status(401).send({ status: "error", error: "Unauthorized" })
        req.user = credentials.user;
        next();
    })
}

export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        return token = req?.cookies['coderCookieToken'];
    }
    return token;
};

const initializePassport = () => {
    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            done(error);
        }
    }
    ));

    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true,
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, birth_date, role } = req.body;
        try {
            let user = await userModel.findOne({ email: username });
            console.log({user})
            if (user) return done(null, false, { message: "User already exists" });
            const newUser = {
                first_name,
                last_name,
                email,
                birth_date,
                password: createHash(password),
                role,
            }
            user = await userModel.create(newUser);

            const miCorreo = {
                from: `Geccia <${config.mailing.USER}>`,
                to: newUser.email,
                subject:"Te has registrado con éxito!",
                html:`<div><h1>¡Felicidades! ${newUser.first_name} ${newUser.last_name}</h1>
                <p> Bienvenido a Geccia!</p>
                </div>`
            }
        
            const mailingService = new MailingService();
            const correo = await mailingService.sendSimpleMail(miCorreo)
            return done(null, user);
        } catch (error) {
            return done({ message: "Error creating user" });
        }
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) return done(null, false, { message: "User not found" });
            if (!validatePassword(user, password)) return done(null, false);
            const { password: pass, ...userNoPass } = user._doc;
            const jwt = generateToken(userNoPass);
            return done(null, jwt);
        } catch (error) {
            return done({ message: "Error logging in" });
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: GITHUB_CLIENTID,
        clientSecret: GITHUB_CLIENTSECRET,
        callbackURL: GITHUB_CALLBACKURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.findOne({ email: profile._json.email })
            if (user) return done(null, user)
            const newUser = {
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                password: ''
            }
            user = await userService.create(newUser)
            return done(null, user);
        } catch (error) {
            return done({ error: `Error creating user via github: ${error.message}` })
        }
    }));

    passport.serializeUser((user, done) => {
        try {
            done(null, user._id)
        } catch (error) {
            done({ error: error.message })
        }
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.findById(id)
            done(null, user)
        } catch (error) {
            done({ error: error.message })
        }
    });
}

export default initializePassport;