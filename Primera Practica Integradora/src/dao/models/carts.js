import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const collection = 'carts';

const schema = new mongoose.Schema({
    id: {
        type: Number,
        require: true
    },
    products: {
        type: Array,
        require: true
    },
});

const AutoIncrement = AutoIncrementFactory(mongoose);

schema.plugin(AutoIncrement, { inc_field: 'id' });

const cartsModel = mongoose.model(collection,schema);

export default cartsModel;