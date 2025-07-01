import ApplicationError from "../../../errorHandling/errorHandling.js";
import mongoose from "mongoose";
import { ProductModel } from "../schema/product.schema.js";
import { ReviewModel } from "../schema/review.schema.js";
import { CategoryModel } from "../schema/category.schema.js";

export default class ProductRepositry {
  constructor() {
    this.collection = "Products";
  }
  async getAllProduct() {
    try {
      const product = await ProductModel.find();
      return product;
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
  async addProduct(productData) {
    try {
      productData.categories = productData.category
        .split(",")
        .map((c) => c.trim());
      delete productData.category;
      productData.size = productData.size.split(",").map((c) => c.trim());
      const newProduct = await new ProductModel(productData);
      const saveProduct = await newProduct.save();
      await CategoryModel.updateMany(
        { _id: { $in: productData.categories } },
        { $push: { products: new mongoose.Types.ObjectId(saveProduct._id) } }
      );
      return saveProduct;
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
  async findProduct(id) {
    try {
      const product = await ProductModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      return product;
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
  async filterProduct(name, minPrice, maxPrice, category, size) {
    try {
      let filterExpression = {};
      if (name) {
        filterExpression.name = { $eq: name };
      }
      if (minPrice) {
        filterExpression.price = { $gt: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lt: parseFloat(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = { $eq: category };
      }
      if (size) {
        filterExpression.size = { $in: Array.isArray(size) ? size : [size] };
      }
      return await ProductModel.find(filterExpression).select({
        name: 1,
        price: 1,
        _id: 0,
      });
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }

  async rateProduct(userId, productId, rating) {
    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new ApplicationError("Product not found", 400);
      } else {
        const userReview = await ReviewModel.findOne({
          product: new mongoose.Types.ObjectId(productId),
          user: new mongoose.Types.ObjectId(userId),
        });
        if (userReview) {
          userReview.rating = rating;
          await userReview.save();
        } else {
          const newReview = await new ReviewModel({
            product: new mongoose.Types.ObjectId(productId),
            user: new mongoose.Types.ObjectId(userId),
            rating: rating,
          });
          const savedReview = await newReview.save();
          product.reviews.push(savedReview._id);
          await product.save();
          return savedReview;
        }
      }
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }

  //aggregation
  async averagePricePerCategory() {
    try {
      const averagePricePerProduct = await ProductModel.aggregate([
        {
          $group: { _id: "$category", averagePrice: { $avg: "$price" } },
        },
      ]);
      return averagePricePerProduct;
    } catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
}
