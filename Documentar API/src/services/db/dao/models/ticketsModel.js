import mongoose from "mongoose";

export const collection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
});

const ticketModel = mongoose.model(collection, ticketSchema);

export default ticketModel;