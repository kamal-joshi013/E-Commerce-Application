import { body, validationResult } from "express-validator";
import ApplicationError from "../errorHandling/errorHandling.js";
export const productValidationForm = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name should not be empty")
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters"),
  body("desc").trim().notEmpty().withMessage("desc should not be empty"),
  body("price").isFloat({ gt: 0 }).withMessage("Price should be positive"),
  body("imageURL").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image is required");
    }
    return true;
  }),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("category should not be empty")
    .isLength({ min: 3 })
    .withMessage("category must be at least 3 characters"),
  body("size").trim().notEmpty().withMessage("size should not be empty"),
  body("stock")
  .isInt({ min: 0 })
  .withMessage("Stock must be a non-negative integer")
,
];

//user form validation
export const validationUserForm = [
  body("username").trim().notEmpty().withMessage("user name should not be empty"),
  body("email")
    .notEmpty()
    .withMessage("user email should not be empty")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password should not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#\$%\^&\*]/)
    .withMessage("Password must contain at least one special character"),
  body("userType").notEmpty().withMessage("userType name should not be empty"),
];

//loginFormValidation
export const userLoginFormValidation = [
  body("email")
    .notEmpty()
    .withMessage("user email should not be empty")
    .isEmail()
    .withMessage("Invalid email format"),
  body("newPassword")
    .notEmpty()
    .withMessage("Password should not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#\$%\^&\*]/)
    .withMessage("Password must contain at least one special character"),
];

//resetPasswordValidationForm
export const resetPasswordValidationForm = [
     body("newPassword")
    .notEmpty()
    .withMessage("Password should not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#\$%\^&\*]/)
    .withMessage("Password must contain at least one special character"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErrorMessage = errors.array()[0].msg;
    throw new ApplicationError(firstErrorMessage, 401);
  }
  next();
};

