import mongoose from "mongoose";
import ApplicationError from "../../../errorHandling/errorHandling.js";
import { LikeModel } from "../schema/like.schema.js";

export default class LikeRepository {
  async likeProduct(userId, productId) {
    try {
      const existingLike = await LikeModel.findOne({
        user: userId,
        likeable: productId,
        types: "Product",
      });

      if (existingLike) {
        return await LikeModel.deleteOne({ _id: existingLike._id });
      }
      const newLike = new LikeModel({
        user:  new mongoose.Types.ObjectId(userId),
        likeable:  new mongoose.Types.ObjectId(productId),
        types: "Product",
      });
      await newLike.save();
      return newLike;
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
  async likeCategory(userId, categoryId) {
    try {
      const existingLike = await LikeModel.findOne({
        user: userId,
        likeable: productId,
        types: "Categories",
      });

      if (existingLike) {
        return await LikeModel.deleteOne({ _id: existingLike._id });
      }
      const newLike = new LikeModel({
        userId:  new mongoose.Types.ObjectId(userId),
        productId:  new mongoose.Types.ObjectId(categoryId),
        types: "Categories",
      });
      await newLike.save();
      return newLike;
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
  async getLike(id, type) {
    try {
      const like = await LikeModel.find({
        likeable:  new mongoose.Types.ObjectId(id),
        types: type,
      })
        .populate("user")
        .populate({ path: "likeable", model: type });
      return like;
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
  async lotalLike(id, type) {
    try {
      const totalLikes = await LikeModel.countDocuments({
        likeable:  new mongoose.Types.ObjectId(id),
        types: type,
      });
      return totalLikes;
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
}
