import OrderRepositry from "../repositry/order.repositry.js";

export default class OrderController{
    constructor(){
        this.orderRepositry = new OrderRepositry();
    }
    async placeOrder(req,res,next){
        try {
            const userId = req.userId;
            await this.orderRepositry.placeOrder(userId);
            res.status(201).send("Order is created");
        } catch(err){
      next(err);
    }
    }
}