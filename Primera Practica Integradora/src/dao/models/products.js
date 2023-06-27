import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const collection = 'products';

const schema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    thumbnail: {
        type: Array,
        require: true
    },
    code: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    },
    category: {
        type: String,
        require: true
    },
});

const AutoIncrement = AutoIncrementFactory(mongoose);

schema.plugin(AutoIncrement, { inc_field: 'id' });

const productsModel = mongoose.model(collection,schema);

export default productsModel;
