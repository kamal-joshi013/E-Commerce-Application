import express from "express";
import UserController from "../controller/user.controller.js";
import { loggerMiddleware } from "../../../middleware/logger.middleware.js";
import jwtAuth from "../../../middleware/jwtAuthentication.middleware.js";
import {
  handleValidationErrors,
  resetPasswordValidationForm,
  userLoginFormValidation,
  validationUserForm,
} from "../../../middleware/formValidation.middleware.js";

const userRoutes = express.Router();
const userController = new UserController();

userRoutes.post(
  "/signUp",
  loggerMiddleware,
  validationUserForm,
  handleValidationErrors,
  (req, res, next) => {
    userController.userSignUp(req, res, next);
  }
);
userRoutes.post(
  "/signIn",
  loggerMiddleware,
  userLoginFormValidation,
  handleValidationErrors,
  (req, res, next) => {
    userController.userSignIn(req, res, next);
  }
);
userRoutes.put(
  "/reset-password",
  jwtAuth,
  loggerMiddleware,
  resetPasswordValidationForm,
  handleValidationErrors,
  (req, res, next) => {
    userController.resetPassword(req, res, next);
  }
);

export default userRoutes;
