import "./env.js"
import express from "express";
import cors from "cors";
import productRouter from "./src/features/product/routes/product.routes.js";
import userRoutes from "./src/features/user/routes/user.routes.js";
import jwtAuth from "./src/middleware/jwtAuthentication.middleware.js";
import cartRouter from "./src/features/cart/routes/cart.routes.js";
import {loggerMiddleware} from "./src/middleware/logger.middleware.js"
import ApplicationError from "./src/errorHandling/errorHandling.js";
import { logger } from "./src/middleware/logger.middleware.js";
import orderRouter from "./src/features/order/routes/order.routes.js";
import { connectUsingMongoose } from "./src/config/dbMongoose.config.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/routes/like.routes.js";
 

const server = express();
server.use(express.json());
server.use(cors());

// server.use(loggerMiddleware);
server.use("/api/product",loggerMiddleware,jwtAuth,productRouter);
server.use("/api/user",userRoutes);
server.use("/api/cart",loggerMiddleware,jwtAuth,cartRouter);
server.use("/api/order",loggerMiddleware,jwtAuth,orderRouter);
server.use("/api/like",jwtAuth,likeRouter)

//error Handling
server.use((err, req, res, next) => {
 const errorData = {
    url: req.url || "unknown",
    body: req.body ? JSON.stringify(req.body) : "{}",
    query: req.query ? JSON.stringify(req.query) : "{}",
    appError: err instanceof ApplicationError ? (err.message) : "Not an ApplicationError",
    serverError: err.stack || "No server error"
  };
  if (err instanceof ApplicationError) {
    logger.error({ message: errorData });
     return res.status(err.code || 400).json(err.message);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    logger.error({ message: errorData });
     return res.status(err.code || 400).json(err.message);
  }

  logger.error({ message: errorData });
  return res.status(500).json({ error: "Something went wrong, please try again later!" });
});


server.listen(3200,()=>{
    console.log("server is start listening at port 3200");
    connectUsingMongoose();
})