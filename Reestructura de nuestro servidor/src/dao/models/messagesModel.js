import mongoose from "mongoose";

const collection = 'messeges';

const schema = new mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    message: {
        type: String
    }
});

const messegesModel = mongoose.model(collection,schema);

export default messegesModel;