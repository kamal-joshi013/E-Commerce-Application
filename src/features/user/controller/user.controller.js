import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepository from "../repositry/user.repository.js";
export default class UserController {
  constructor(){
    this.userRepository = new UserRepository();
  }
  async userSignUp(req, res,next) {
    try{
    const { username, email, password, userType } = req.body;
    const newUser = await this.userRepository.signUp(username,email,password,userType); 
    res.status(201).send(newUser);
    }catch(err){
     next(err);
    }
  }
  async userSignIn(req, res,next) {
    try{
    const { email, password, } = req.body;
    const user = await this.userRepository.findByEmail(email);
    if(!user){
      res.status(400).send("Worng credentials!");      
    }else{
      const matchPassword = await bcrypt.compare(password,user.password);
      if(matchPassword){
        const token = jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'5d'})
      res.status(200).send(token);
      } else {
      res.status(400).send("Worng credentials!");
    }
  }
  }catch(err){
    next(err)
  }
 }
 async resetPassword(req,res,next){
  const{newPassword} = req.body;
  const userId = req.userId;
  try{
   const hashPassword =  await bcrypt.hash(newPassword,12);
    await this.userRepository.resetPassword(userId,hashPassword);
    res.status(200).send("Password reset successfully!");
  }catch(err){
    next(err)
  }
 }
}
