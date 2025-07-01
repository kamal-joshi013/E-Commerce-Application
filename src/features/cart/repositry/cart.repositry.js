import ApplicationError from "../../../errorHandling/errorHandling.js";
import { CartModel } from "../schema/cart.schema.js";
import { CounterModel } from "../../../config/counter.schema.js";
import mongoose from "mongoose";
export default class CartRepositry {
  async addCartItems(productId, userId, quantity) {
    try {
      const existingItem = await CartModel.findOne({
        productId: new mongoose.Types.ObjectId(productId),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (existingItem) {
        await CartModel.updateOne(
          {
            _id: existingItem._id,
          },
          {
            $inc: { quantity: quantity },
          }
        );
      } else {
        const id = await this.getNextCounter();
        await CartModel.create({
          _id: id,
          productId: new mongoose.Types.ObjectId(productId),
          userId: new mongoose.Types.ObjectId(userId),
          quantity: quantity,
        });
      }
    } catch (error) {
      console.error(error);
      throw new ApplicationError(error, 400);
    }
  }
  async getCartItem(userId) {
    try {
      const product = await CartModel.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
      return product;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(error, 400);
    }
  }

  async deleteCartItem(cartId, userId) {
    try {
      const deletedIteam = await CartModel.deleteOne({
        _id: cartId,
        userId: new mongoose.Types.ObjectId(userId),
      });
      return deletedIteam.deletedCount > 0;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(error, 400);
    }
  }
  async getNextCounter(db) {
    const resultDocument = await CounterModel.findOneAndUpdate(
      { _id: "cartItemId" },
      { $inc: { value: 1 } },
      {
        returnDocument: "after",
      }
    );
    return resultDocument.value;
  }
}
