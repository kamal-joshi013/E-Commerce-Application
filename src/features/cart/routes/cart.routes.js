import express from "express";
import CartCantroller from "../cantroller/cart.cantroller.js";
const cartRouter = express.Router();
const cartCantroller = new CartCantroller();

cartRouter.post("/:productId",(req,res,next)=>{
    cartCantroller.addItem(req,res,next)
});
cartRouter.get("/",(req,res,next)=>{
    cartCantroller.getCartItem(req,res,next);
});
cartRouter.delete("/:id",(req,res,next)=>{
    cartCantroller.deleteCartItem(req,res,next);
});

export default cartRouter;
