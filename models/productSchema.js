import mongoose from "mongoose";
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const productSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      minLength: [3, "Product name is too short"],
      maxLength: [32, "Too many characters"],
    },
    description: { type: String, required: true, maxLength: [3000, "Way too big"] },
    category: { type: String, required: [true, "Category is required"] },
    subCategory: [{ type: String }],
    unitPrice: { type: Number, required: true, maxLength: [9, "Amount out of line"] },
    quantity: { type: Number, maxLength: [9, "Amount out of line"] },
    supplier: { type: ObjectId, ref: "User", required: true },
    photo: [{ type: Object, required: true }],
    // photo: { data: Buffer, contentType: String },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
