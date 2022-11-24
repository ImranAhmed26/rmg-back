import express from "express";

import { adminToken, buyerToken, supplierToken, userToken } from "../middleware/authToken.js";
import {
  createProduct,
  getProducts,
  getProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getPhoto,
} from "../controllers/productController.js";

const router = express.Router();

router
  .post("/createProduct", supplierToken, createProduct)
  .get("/", getProducts)
  .get("/myproducts", supplierToken, getMyProducts)
  .get("/photo/:id", getPhoto)
  .get("/:id", userToken, getProduct)
  .put("/:id", supplierToken, updateProduct)
  .delete("/:id", supplierToken, deleteProduct);

export default router;
