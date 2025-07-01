import ApplicationError from "../../../errorHandling/errorHandling.js";
import CartRepositry from "../repositry/cart.repositry.js";
export default class CartCantroller {
  constructor() {
    this.cartRepositry = new CartRepositry();
  }
  async addItem(req, res, next) {
    try {
      const { quantity } = req.body;
      const {productId} = req.params;
      const userId = req.userId;
      await this.cartRepositry.addCartItems(
        productId,
        userId,
        Number(quantity)
      );
      res.status(201).send("Item add successfully!");
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getCartItem(req, res,next) {
    try{
    const userId = req.userId;
    const item = await this.cartRepositry.getCartItem(userId);
    res.status(200).send(item);
    }catch (err) {
      console.error(err);
      next(err);
    }
  }
  async deleteCartItem(req, res,next) {
    try{
    const userId = req.userId;
    const cartId = req.params.id;
    const deletedIteam =  await this.cartRepositry.deleteCartItem(cartId,userId);
    if(!deletedIteam){
      throw new ApplicationError("Iteam not found")
    }
    res.status(200).send("Item removed successfully!");
    }catch (err) {
      console.error(err);
      next(err);
    }
  }
}
