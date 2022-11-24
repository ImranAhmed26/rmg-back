import express from "express";

import {
  createRequestInfo,
  getRequestInfos,
  getMyRequestInfos,
  getRequestInfo,
  replyToRequestInfo,
} from "../controllers/requestInfoController.js";
import { userToken, adminToken } from "../middleware/authToken.js";

const router = express.Router();

router
  .post("/", userToken, createRequestInfo)
  .get("/", userToken, getRequestInfos)
  .get("/myrequests", userToken, getMyRequestInfos)
  .get("/:id", userToken, getRequestInfo)
  .put("/:id", adminToken, replyToRequestInfo);

export default router;
