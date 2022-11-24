import Product from "../models/productSchema.js";
import RequestInfo from "../models/requestInfoSchema.js";
import User from "../models/userSchema.js";

const createRequestInfo = async (req, res) => {
  try {
    const { product } = req.body;

    const createRequest = new RequestInfo({
      requestName: "Supplier Information requested",
      product,
      user: req.user._id,
    });
    const saveRequest = await createRequest.save();
    res.status(200).send(saveRequest);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getRequestInfos = async (req, res) => {
  try {
    const getRequests = await RequestInfo.find()
      .populate("user", "name email phone companyName")
      .populate("product", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(getRequests);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getMyRequestInfos = async (req, res) => {
  try {
    const getRequests = await RequestInfo.find({ user: req.user._id })
      .populate("user", "name email phone companyName")
      .populate("product", "name")
      .sort({ createdAt: -1 });
    console.log(getRequests);
    res.status(200).json(getRequests);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getRequestInfo = async (req, res) => {
  try {
    const request = await RequestInfo.findById(req.params.id).populate(
      "user",
      "name email phone companyName",
    );
    res.status(200).json(request);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const replyToRequestInfo = async (req, res) => {
  try {
    const request = await RequestInfo.findByIdAndUpdate(req.params.id)
      .populate("user", "name email phone companyName")
      .populate("product", "name");
    const supplierInfo = await Product.findById(request.product).populate(
      "supplier",
      "name email phone companyName",
    );
    const supplierDetails = supplierInfo.supplier;
    if (supplierDetails) request.supplierInfo = supplierDetails;
    const updatedRequest = await request.save();
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export {
  createRequestInfo,
  getRequestInfos,
  getMyRequestInfos,
  getRequestInfo,
  replyToRequestInfo,
};
