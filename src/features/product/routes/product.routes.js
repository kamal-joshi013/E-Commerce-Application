import express from "express";
import ProductController from "../controller/product.controller.js";
import { uploads } from "../../../middleware/fileUploade.middleware.js";
import { handleValidationErrors, productValidationForm } from "../../../middleware/formValidation.middleware.js";
const productRouter = express.Router();
const productController = new ProductController();


productRouter.get("/",(req,res,next)=>{
    productController.getAllProduct(req,res,next);
});
productRouter.post("/",uploads.single("imageURL"),productValidationForm,handleValidationErrors,(req,res,next)=>{
    productController.addProduct(req,res,next);
});
productRouter.post("/rating/:productId",(req,res,next)=>{
    productController.rateProduct(req,res,next);
});
productRouter.get("/filter",(req,res,next)=>{
    productController.getFillterProduct(req,res,next);
});
productRouter.get("/average-price",(req,res,next)=>{
    productController.averagePricePerProduct(req,res,next);
});
productRouter.get("/:id",(req,res,next)=>{
    productController.findProduct(req,res,next);
});


export default productRouter;
