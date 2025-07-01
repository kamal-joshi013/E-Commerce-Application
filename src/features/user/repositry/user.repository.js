import mongoose from "mongoose";
import { UserModel } from "../schema/user.schema.js";
import ApplicationError from "../../../errorHandling/errorHandling.js";



export default class UserRepository {
  async signUp(username,email,password,userType) {
   try {
      const newUser = await new UserModel({username,email,password,userType});
      await newUser.save();
      return newUser;
    } catch (error) {
      if(error instanceof mongoose.Error.ValidationError){
        throw error;
      }else{throw new ApplicationError(error, 400);}
    }
  }
  async findByEmail(email){
    try{
        return await UserModel.findOne({email})
    }catch (error) {
      throw new ApplicationError(error, 400);
    }
  }

  async resetPassword(userId,newPassword){
    try{
      const user = await UserModel.findById(userId);
      if(user){
        user.password = newPassword;
        user.save();
      }else{
        throw new ApplicationError("User not found", 400);
      }
    }catch (error) {
      throw new ApplicationError(error, 400);
    }
  }
}
