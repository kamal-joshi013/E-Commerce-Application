import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    _id:String,
    value:{
        type:Number,
        default:0
    },
})
export const CounterModel = new mongoose.model('Counter',counterSchema);