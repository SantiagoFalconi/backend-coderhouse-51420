import { Router } from 'express';
import userModel from '../dao/models/usersModel.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
    const user = {
        first_name,
        last_name,
        email,
        age,
        password 
    }
    await userModel.create(user);
    res.send({ status: "success", message: "User registered" });
})

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

    res.send({ status: "success", payload: req.session.user, message: "First login done!" });
})

export default router;