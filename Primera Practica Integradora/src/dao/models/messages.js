import mongoose from "mongoose";

const collection = 'messeges';

const schema = new mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    messege: {
        type: String,
        require: true
    },
});

const messegesModel = mongoose.model(collection,schema);

export default messegesModel;