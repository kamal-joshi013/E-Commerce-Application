import mongoose from "mongoose";
 const cartSchema = new mongoose.Schema({
    _id:Number,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quantity: Number,
});
export const CartModel = new mongoose.model('Cart',cartSchema);