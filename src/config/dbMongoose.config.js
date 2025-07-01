import mongoose from "mongoose";
import dotenv from "dotenv";
import { CategoryModel } from "../features/product/schema/category.schema.js";
import ApplicationError from "../errorHandling/errorHandling.js";
import { CounterModel } from "./counter.schema.js";

dotenv.config();
const url = process.env.DB_URL;
export const connectUsingMongoose = () => {
  mongoose
    .connect(url)
    .then(() => console.log("mongoose is connected"))
    .catch((err) => {
      throw new ApplicationError(err, 400);
    });
  addCategory();
  createCounter();
};

async function addCategory() {
  try {
    const category = await CategoryModel.find();
    if (!category || category.length == 0) {
      await CategoryModel.insertMany([
        { name: "Books" },
        { name: "Clothing" },
        { name: "Electronics" },
      ]);
      console.log("Categories added!");
    }
  } catch (error) {
    throw new ApplicationError(error, 400);
  }
}
const createCounter =async()=>{
   const  existCounter = await CounterModel.findOne({_id:"cartItemId"});
   if(!existCounter){
    await CounterModel.create({_id:"cartItemId",value:0});
   }
}