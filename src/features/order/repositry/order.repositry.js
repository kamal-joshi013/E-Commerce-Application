import ApplicationError from "../../../errorHandling/errorHandling.js";
import mongoose, { Types } from "mongoose";
import { OrderModel } from "../schema/order.schema.js";
import { ProductModel } from "../../product/schema/product.schema.js";
import { CartModel } from "../../cart/schema/cart.schema.js";

export default class OrderRepositry {
  async placeOrder(userId) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      //1.get cart items and calculate total
      const items = await this.getTotalAmount(userId);
      const totalFinalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      // console.log("totalFinalAmount", totalFinalAmount);
      //2. create an order record
      const newOrder = await new OrderModel({
        userId: new mongoose.Types.ObjectId(userId),
        totalAmount: totalFinalAmount,
        timestamp: new Date(),
      });
      // console.log("newOrder", newOrder);

      await newOrder.save({ session });
      //reduce the stock
      for (let item of items) {
        const result = await ProductModel.updateOne(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session }
        );
        if (result.matchedCount === 0) {
          throw new ApplicationError("Insufficient stock");
        }
      }
      //4.clear the cart items
      await CartModel.deleteMany(
        { userId: new mongoose.Types.ObjectId(userId) },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      return;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new ApplicationError(error, 400);
    }
  }

  async getTotalAmount(userId, session) {
    try {
      const items = await CartModel.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $addFields: {
            totalAmount: { $multiply: ["$productInfo.price", "$quantity"] },
          },
        },
      ]).session(session);
      return items;
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
}
