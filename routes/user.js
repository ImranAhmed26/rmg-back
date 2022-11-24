import express from "express";

import { deleteUser, getUser, getUsers, updateUser } from "../controllers/userController.js";
import { adminToken, buyerToken, supplierToken, userToken } from "../middleware/authToken.js";

const router = express.Router();

router
  .get("/", adminToken, getUsers)
  .get("/:id", getUser)
  .put("/:id", updateUser)
  .delete("/:id", adminToken, deleteUser);

export default router;
