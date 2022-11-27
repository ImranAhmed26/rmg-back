import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const validToken = (req) => {
  let token;

  if (req.headers) {
    const { authorization } = req.headers;
    let match = authorization.split(" ")[1];
    // let match2 = req.headers.cookie.match(new RegExp("(^| )" + "token" + "=([^;]+)"));   // Method using Cookie
    if (match) {
      // token = match[2]; // Method using Cookie
      token = match;
    } else {
      console.log("--smt went wrong--");
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    console.log("Token validation successful");
    return decoded;
  } else {
    throw new Error("Not authorized, token failed");
  }
};

export const adminToken = async (req, res, next) => {
  try {
    const data = validToken(req);
    const { _id, type } = data;
    if (type === "admin") {
      req.user = await User.findById(_id).select("-password");
      next();
    } else {
      res.status(401).send({ error: "Not authorized as Admin" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ Error: "Not authorized as Admin" });
  }
};

export const supplierToken = async (req, res, next) => {
  try {
    const data = validToken(req);
    const { _id, type } = data;
    if (type === "supplier" || type === "admin") {
      req.user = await User.findById(_id).select("-password");
      next();
    } else {
      res.status(401).send({ message: "Not authorized as Supplier" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "not authorized as Supplier" });
  }
};

export const buyerToken = async (req, res, next) => {
  try {
    const data = validToken(req);
    const { _id, type } = data;
    if (type === "buyer") {
      req.user = await User.findById(_id).select("-password");
      next();
    } else {
      res.status(401).send({ message: "Not authorized as Buyer" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ Error: "Not authorized as Buyer" });
  }
};

export const userToken = async (req, res, next) => {
  try {
    const data = validToken(req);
    // console.log("data is: ", data);
    const { _id, type } = data;
    if (type === "buyer" || type === "supplier" || type === "admin") {
      req.user = await User.findById(_id).select("-password");
      next();
    } else {
      res.status(401).send({ error: "Not authorized as user" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Not authorized as a valid user" });
  }
};
