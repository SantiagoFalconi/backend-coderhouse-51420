import { Router } from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import UserDTO from '../services/db/dto/user.dto.js';
import { UsersController } from '../controllers/users.controller.js'
import { setLastConnection } from '../controllers/users.controller.js'

const router = Router();
router.use(cookieParser());

const usersController = new UsersController();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: 'api/sessions/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.send(new UserDTO (req.user.user));
});

router.post('/login', passport.authenticate('login', { session: false }), setLastConnection(),  (req, res) => {
    res.cookie('coderCookieToken', req.user, { httpOnly: true }).send({ status: "success", message: "cookie set" })
});

router.get('/logout', setLastConnection(), (req, res) => { res.clearCookie('coderCookieToken').send({ status: "success", message: "cookie deleted"})
}); 

router.post('/register', passport.authenticate('register', { session: false }), (req, res) => {
    res.send(req.user);
});

router.post('/premium/:uid', async (req, res) =>{
    try {
        const { uid } = req.params
        const user = await usersController.updateUserRole(uid)
        return res.send ( {message : 'User role updated', user })
    } catch (e) {
        res.json({error: e})
    }
});

router.post('/:uid/products', uploader('products').array('documents'), async (req, res) => {
    const { uid } = req.params;
    const user = await usersController.updateUserDocuments(uid, req.files);
    res.send( { messege: 'User products updated', user });
}); 

router.post('/:uid/profiles', uploader('profiles').array('documents'), async (req, res) => {
    const { uid } = req.params;
    const user = await usersController.updateUserDocuments(uid, req.files);
    res.send( { messege: 'User profile updated', user });
}); 

router.post('/:uid/documents', uploader('documents').array('documents'), async (req, res) => {
    const { uid } = req.params;
    const user = await usersController.updateUserDocuments(uid, req.files);
    res.send( { messege: 'User documents updated', user });
}); 

const setLastConnection = async (req, res, next) => {
    try {
        const { email } = req.body;
        await usersController.setLastConnection(email);
        next();
    } catch (error){
        res.json({ error })
    }
};

export default router;