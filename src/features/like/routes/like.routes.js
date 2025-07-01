import express from "express";
import LikeController from "../controller/like.controller.js";
const likeController = new LikeController();
const likeRouter = express.Router();
likeRouter.post("/", (req, res, next) => {
  likeController.likeItem(req, res, next);
});
likeRouter.get("/", (req, res, next) => {
  likeController.getLike(req, res, next);
});
likeRouter.get("/total-like", (req, res, next) => {
  likeController.totalLike(req, res, next);
});
export default likeRouter;
