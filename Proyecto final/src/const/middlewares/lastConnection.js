import { UsersController } from '../controllers/users.controller.js'

const usersController = new UsersController();

export default setLastConnection = async (req, res, next) => {
    try {
        const { email } = req.body;
        await usersController.setLastConnection(email);
        next();
    } catch (error){
        res.json({ error })
    }
};