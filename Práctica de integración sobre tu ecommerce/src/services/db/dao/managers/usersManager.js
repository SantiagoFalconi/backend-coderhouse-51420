import userModel from "../models/usersModel.js";    

export default class UsersManager {
    userModel;

    constructor() {
        this.userModel = userModel;
    }

    async getAllUsers() {
        try{
            const users = await this.userModel.find({});
            return users;
        } catch (error){
            console.log(error)
        };
    }

    async getUserById(id) {
        try {
            const userData = await this.userModel.findOne({ _id: id});
            return userData;
        }  catch (error){
            console.log(error)
        }
    }

    async toggleUserRole(user) {
        try {
            if(user.role === 'premium'){
                await user.updateOne({ role : 'user'})
            } else {
                await user.updateOne({ role: 'premium' })
            }
        }  catch (e) {
            res.json({ error: e});
        }
    }

    async getUserByEmail(email) {
        try {
            const userData = await this.userModel.findOne({ email })
            return userData
        }
        catch (error) {
        console.log(error)
        }
    }

    async setLastConnection(user){
        try{
            return await user.updateOne({last_connection: new Date()})
        } catch (error) {
            console.log(error)
        }
    }
}