import ApplicationError from "../../../errorHandling/errorHandling.js";
import LikeRepository from "../repository/like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }
  async likeItem(req, res, next) {
    try {
      const userId = req.userId;
      const { id, type } = req.query;
      if (type != "Product" && type != "Categories") {
        throw new ApplicationError("Invalid type", 400);
      }
      if (type === "Product") {
        const like = await this.likeRepository.likeProduct(userId, id);
        // console.log(like.deletedCount);

        if (like.deletedCount === 1) {
          return res.status(200).send("Unliked");
        }
        return res.status(201).send(like);
      }
      if (type === "Categories") {
        const like = await this.likeRepository.likeCategory(userId, id);
        if (like.deletedCount === 1) {
          return res.status(200).send("Unliked");
        }
        return res.status(201).send(like);
      }
    } catch (err) {
      next(err);
    }
  }
  async getLike(req, res, next) {
    try {
      const { id, type } = req.query;
      const like = await this.likeRepository.getLike(id, type);
      res.status(200).send(like);
    } catch (err) {
      next(err);
    }
  }
  async totalLike(req,res,next){
    try{
        const{id,type} = req.query;
        const allLike = await this.likeRepository.lotalLike(id,type);
        console.log(allLike);
        return res.status(200).send(allLike);
    }catch (err) {
      next(err);
    }
  }
}
