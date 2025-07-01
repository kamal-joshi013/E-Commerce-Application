import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    totalAmount:{
        type:Number
    },
    timestamp:{
         type: Date,
    }
})

export const OrderModel = new mongoose.model('Order',orderSchema);