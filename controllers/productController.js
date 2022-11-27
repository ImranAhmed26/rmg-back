import fs from "fs";
import formidable from "formidable";
import _ from "lodash";
import { cloudinary } from "../utils/cloudinaryConfig.js";

import Product from "../models/productSchema.js";
import User from "../models/userSchema.js";

const createProduct = async (req, res) => {
  // console.log("req", req.user._id);
  const { name, description, category, unitPrice, quantity, supplier, photo } = req.body;
  if (!name || !description || !unitPrice || !category || !quantity)
    return res.status(400).json({ error: "Missing fields. All fields are required." });

  try {
    if (photo) {
      const uploadRes = await cloudinary.uploader.upload(photo, {
        upload_preset: "rmg-products",
      });
      if (uploadRes) {
        const product = new Product({
          name,
          description,
          category,
          unitPrice,
          quantity,
          supplier,
          photo: uploadRes,
        });
        const saveProduct = await product.save();
        res.status(200).send(saveProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("supplier", "name id");
    // product.photo = undefined;
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(200).send("Error. Please try again");
  }
};

const getProducts = async (req, res) => {
  // console.log(req.user);
  try {
    let products = Product.find({}).populate("supplier", "name id").sort({ createdAt: -1 });

    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.limit || 12);
    const skip = (page - 1) * pageSize;
    const total = await Product.countDocuments();
    const pages = Math.ceil(total / pageSize);

    products = products.skip(skip).limit(pageSize);

    if (page > pages) {
      return res.status(400).json({ status: "failed", message: "Page not found" });
    }

    const result = await products;

    res.status(200).json({
      status: "Success",
      count: result.length,
      page,
      pages,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error. Please try again");
  }
};
const getMyProducts = async (req, res) => {
  try {
    let products = Product.find({ supplier: req.user._id }).sort({ createdAt: -1 });

    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.limit || 12);
    const skip = (page - 1) * pageSize;
    const total = await Product.countDocuments();
    const pages = Math.ceil(total / pageSize);

    products = products.skip(skip).limit(pageSize);

    if (page > pages) {
      return res.status(400).json({ status: "failed", message: "Page not found" });
    }

    const result = await products;

    res.status(200).json({
      status: "Success",
      count: result.length,
      page,
      pages,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error. Please try again");
  }
};

const updateProduct = async (req, res) => {
  // console.log("req is", req);
  let product = await Product.findById(req.params.id);
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, files) => {
    // console.log("fields are: ", fields);
    // console.log("photo is: ", files);
    if (error) {
      return res.status(400).json({ error: "image could not be uploaded" });
    }
    const { name, description, unitPrice, quantity, category, subCategory, supplier } = fields;
    if (!name || !description || !unitPrice || !category || !quantity) {
      return res.status(400).json({ error: "Missing fields. All fields are required." });
    }
    if (name) product.name = name;
    if (description) product.description = description;
    if (unitPrice) product.unitPrice = unitPrice;
    if (quantity) product.quantity = quantity;
    if (category) product.category = category;

    if (files.photo) {
      if (files.photo.size > 512000) {
        return res.status(400).json({ error: "File size should be below 512 KB" });
      }

      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }
    product.save((error, result) => {
      if (error) {
        return res.status(400).json({ error: "error saving file" });
      }
      res.status(200).json(result);
    });
  });
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getPhoto = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const productImage = product.photo;
  if (productImage !== null) {
    res.set("Content-Type", productImage.contentType);
    return res.send(productImage.data);
  } else {
    return res.status(400).json({ error: "File not found" });
  }
};
export {
  createProduct,
  getProducts,
  getProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getPhoto,
};

// const createProduct = (req, res) => {
//   const __x_ = 20;
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (error, fields, files) => {
//     // console.log("files data: ", files);
//     if (error) {
//       return res.status(400).json({ error: "image could not be uploaded" });
//     }
//     const { name, description, unitPrice, quantity, category, subCategory, supplier } = fields;
//     if (!name || !description || !unitPrice || !category || !quantity) {
//       return res.status(400).json({ error: "Missing fields. All fields are required." });
//     }
//     let product = new Product(fields);
//     if (files.photo) {
//       if (files.photo.size > 512000) {
//         return res.status(400).json({ error: "File size should be below 512 KB" });
//       }

//       product.photo.data = fs.readFileSync(files.photo.filepath);
//       product.photo.contentType = files.photo.mimetype;
//     }
//     product.save((error, result) => {
//       if (error) {
//         return res.status(400).json({ error: "error saving file" });
//       }
//       res.json(result);
//     });
//   });
// };

// const updateProducts = async (req, res) => {
//   let { name, description, unitPrice, quantity, category, subCategory, photo } = req.body;
//   try {
//     let product = await Product.findByIdAndUpdate(req.params.id);
//     if (!product) return res.status(400).send("Error. Please try again");

//     if (name) product.name = name;
//     if (description) product.description = description;
//     if (unitPrice) product.unitPrice = unitPrice;
//     if (quantity) product.quantity = quantity;
//     if (category) product.category = category;
//     if (subCategory) product.subCategory = subCategory;
//     if (photo) product.photo = photo;

//     const updatedProduct = await product.save();
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send("Error, Please try again");
//   }
// };
