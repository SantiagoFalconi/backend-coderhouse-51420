import { Router } from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import UserDTO from '../services/db/dto/user.dto.js';
import { changeOfRol } from '../controllers/users.controller.js'

const router = Router();
router.use(cookieParser());

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: 'api/sessions/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.send(new UserDTO (req.user.user));
});

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    res.cookie('coderCookieToken', req.user, { httpOnly: true }).send({ status: "success", message: "cookie set" })
});

router.post('/register', passport.authenticate('register', { session: false }), (req, res) => {
    res.send(req.user);
});

router.post('/premium/:uid', changeOfRol);

export default router;