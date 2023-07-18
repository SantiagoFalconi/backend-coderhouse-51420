import { Router } from 'express';
import userModel from '../dao/models/usersModel.js';
import bcrypt from 'bcrypt';
import { authToken, generateToken } from '../utils.js';
import passport from 'passport';

const router = Router();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: 'api/sessions/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
        }
        await userModel.create(user);
        const access_token = generateToken(user);
        res.send({ status: "success", access_token });   
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'An internal server error occurred' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email, password });

    if (!user) return res.status(400).send({ status: "error", error: "User does not exists" });

    if (user.password !== password) {
        return res.status(400).send({ status: "error", error: "User exists but password is incorrect" });
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        admin: user.email === "adminCoder@coder.com" && password === "admincoder"
    }

    const access_token = generateToken(user);
    res.send({ status: "success", access_token });
})

router.get('/current', authToken, (req, res) => {
    res.send({ status: "success", payload: req.user })
})

export default router;