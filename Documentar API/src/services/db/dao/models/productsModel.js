import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import userModel from './usersModel.js';

const collection = 'products';

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        default: "admin",
        validate: async function (ownerEmail) { 
            const user = await userModel.findOne({ email: ownerEmail }); 
            return user && user.role === "premium";
        },
    }    
});

schema.plugin(mongoosePaginate);
const productsModel = mongoose.model(collection,schema);

export default productsModel;
