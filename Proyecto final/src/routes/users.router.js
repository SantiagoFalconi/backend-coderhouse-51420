import { Router } from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import UserDTO from '../services/db/dto/user.dto.js';
import { UsersController } from '../controllers/users.controller.js'
import { setLastConnection } from '../controllers/users.controller.js'
import { setLastConnection } from '../const/middlewares/lastConnection.js'
import userModel from '../services/db/dao/models/usersModel.js';
import MailingService from '../services/email/mailing.js'

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

router.get('/', async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name last_name email role'); 
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/', async (req, res) => {
    
    const mailingService = new MailingService();

    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setMinutes(twoDaysAgo.getMinutes() - 2880); 

        const result = await userModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });
        if (result.deletedCount > 0) {
            result.deletedUsers.forEach(async (user) => {
                const mailOptions = {
                    from: 'tpa.toyz099@gmail.com',
                    to: user.email,
                    subject: 'Account deleted due to inactivity',
                    text: 'Your account has been deleted due to inactivity'
                };

                try {
                    const sendResult = await mailingService.sendSimpleMail(mailOptions);
                    console.log('Email sent:', sendResult);
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            });

            res.status(200).json({ message: 'Inactive users deleted and notified by email' });
        } else {
            res.status(404).json({ message: 'No inactive users found to delete' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;