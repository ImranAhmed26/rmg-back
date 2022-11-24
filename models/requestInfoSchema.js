import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const RequestInfoSchema = new mongoose.Schema(
  {
    requestName: { type: String, required: true },
    productName: String,
    product: { type: ObjectId, ref: "Product", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    supplierInfo: {
      name: String,
      email: String,
      phone: String,
      companyName: String,
    },
  },
  { timestamps: true },
);

const RequestInfo = mongoose.model("RequestInfo", RequestInfoSchema);

export default RequestInfo;
