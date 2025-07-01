import ApplicationError from "../../../errorHandling/errorHandling.js";
import ProductRepositry from "../repositry/product.repositry.js";
export default class ProductController {
  constructor() {
    this.productRepositry = new ProductRepositry();
  }
  async getAllProduct(req, res,next) {
    try{
    const product = await this.productRepositry.getAllProduct();
    return res.status(200).send(product);
    }catch(err){
      next(err);
    }
  }
  async addProduct(req, res,next) {
    try {
      const { name, desc, price, category, size, stock } = req.body;
      const imageURL = req.file.filename;
      const newProductData = {
        name,
        desc,
        price,
        imageURL,
        category,
        size,
        stock
      }
      const product = await this.productRepositry.addProduct(newProductData);
      return res.status(201).send(product);
    }catch (err) {
      next(err);
    }
  }
  async findProduct(req, res,next) {
    try {
      const productId = req.params.id;
      const product = await this.productRepositry.findProduct(productId);
      if (!product) {
        throw new ApplicationError("product not found", 400);
      }
      return res.status(200).send(product);
    } catch (err) {
      next(err);
    }
  }
  async getFillterProduct(req, res,next) {
    try {
      const name = req.query.name;
      const minPrice = Number(req.query.minPrice);
      const maxPrice = Number(req.query.maxPrice);
      const category = req.query.category;
      const size = req.query.size;
      const product = await this.productRepositry.filterProduct(
        name,
        minPrice,
        maxPrice,
        category,
        size
      );
      return res.status(200).send(product);
    }catch (err) {
      next(err);
    }
  }
  async rateProduct(req, res, next) {
    try {
      const userId = req.userId;
      const productId = req.params.productId;
      const rating = Number(req.body.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ApplicationError(
          "Invalid rating. Must be an integer between 1 and 5.",
          400
        );
      }
      await this.productRepositry.rateProduct(userId, productId, rating);
      return res.status(201).send("Rating added successfully!");
    } catch (err) {
      next(err);
    }
  }
  async averagePricePerProduct(req,res,next){
    try{
      const averagePrice = await this.productRepositry.averagePricePerCategory();
      return res.status(200).send(averagePrice);
    }catch (err) {
      next(err);
    }
  }
}
