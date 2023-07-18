import { Request, Response } from "express";
import { JwtSecret, internalServerErrorMessage } from "../config";
import {
  findAllUsersWithProfiles,
  deleteUser,
  updateEmail,
  findAllPromoCodes,
  removePromoCode,
  editPromoCode,
  createPromoCode,
  findAllOrdersWithService,
  editOrder,
  findOrderById,
  findProductsWithDetails,
  findProductWithDetail,
  removeProduct,
} from "../services/adminService";
import AdministratorSchema from "../models/administrator";
import Productschema from "../models/product";
import ProductDetail from "../models/productDetail";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  const { adminID, password } = req.body;
  if (!adminID || !password) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Missing param: " + (adminID ? "password" : "adminID"),
    });
  }
  try {
    //find admin
    const admin = await AdministratorSchema.findOne({ adminID: adminID });
    if (!admin) {
      return res.status(404).json({
        error: "Not Found",
        message: "Admin not found",
      });
    }
    //check correct password
    if (password !== admin.password) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Wrong password",
      });
    }
    const expirationTime = 86400; // expires in 24 hours
    // create a token
    const token = jwt.sign(
      { id: admin.id, adminID: admin.adminID },
      JwtSecret,
      {
        expiresIn: expirationTime, // expires in 24 hours
      }
    );
    return res.status(200).json({
      token: token,
      expiresIn: expirationTime,
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getAllUsersWithProfiles(req: Request, res: Response) {
  let { keyWords } = req.query;
  if (!keyWords || typeof keyWords != "string") {
    keyWords = "";
  }
  try {
    const user_profile = await findAllUsersWithProfiles(keyWords);
    return res.status(200).send(user_profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function deleteUserWithProfile(req: Request, res: Response) {
  const userID = req.params.userID;
  try {
    await deleteUser(userID);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function updateUserEmail(req: Request, res: Response) {
  const userID = req.params.userID;
  const email = req.params.email;
  try {
    await updateEmail(userID, email);
    return res.status(200).json({
      message: "Email update successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getAllPromoCode(req: Request, res: Response) {
  const { keyWords = "" } = req.query || {};
  try {
    //@ts-ignore
    const promocode = await findAllPromoCodes(keyWords);
    return res.status(200).send(promocode);
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function deletePromoCode(req: Request, res: Response) {
  const { promoCodeID } = req.body;
  try {
    await removePromoCode(promoCodeID);
    return res.status(200).json({
      message: "Promo Code deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function updatePromoCode(req: Request, res: Response) {
  const { promocodeID, code, expirationDate, discountRate, minThreshold } =
    req.body;
  try {
    try {
      await editPromoCode(
        promocodeID,
        code,
        expirationDate,
        discountRate,
        minThreshold
      );

      return res.status(200).send({ code: 0, message: "sucess" });
    } catch (err) {
      console.log(err);
      return res.status(200).send({ code: -1, message: err });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function addPromoCode(req: Request, res: Response) {
  const { code, expirationDate, discountRate, minThreshold } = req.body;

  try {
    try {
      await createPromoCode(code, expirationDate, discountRate, minThreshold);
      return res.status(200).send({ code: 0, message: "sucess" });
    } catch (err) {
      return res.status(200).send({ code: -1, message: err });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getAllOrdersWithService(req: Request, res: Response) {
  let { keyWords } = req.query;
  if (!keyWords || typeof keyWords != "string") {
    keyWords = "";
  }
  try {
    const orders_service = await findAllOrdersWithService(keyWords);
    return res.status(200).send(orders_service);
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function updateOrder(req: Request, res: Response) {
  const orderID = req.params.orderID;
  const status = req.params.status;
  const trackingnumber = req.params.trackingnumber;
  try {
    await editOrder(orderID, status, trackingnumber);
    return res.status(200).json({
      message: "Order update successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const orderID = req.params.orderID;
    const order = await findOrderById(orderID);
    if (!order) {
      return res.status(404).json({
        error: "Not Found",
        message: `Order with ID:${orderID} not found!`,
      });
    }
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getProductsWithDetails(req: Request, res: Response) {
  try {
    let { keywords } = req.query;
    if (!keywords || typeof keywords != "string") {
      keywords = "";
    }
    console.log("keywords" + keywords);
    const productsWithDetails = await findProductsWithDetails(keywords);
    return res.status(200).send(productsWithDetails);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getProductWithDetail(req: Request, res: Response) {
  try {
    console.log("in getProductWithDetail");
    const { productID } = req.params;
    const productWithDetail = await findProductWithDetail(productID);
    return res.status(200).send(productWithDetail);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { productID } = req.params;
    const result = await removeProduct(productID);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function addProduct(req: Request, res: Response) {
  const product = new Productschema({
    productID: req.body.productID,
    category: req.body.category,
    imageUrl: req.body.imageUrl,
    nutriScore: req.body.nutriScore,
    capacity: req.body.capacity,
    productBrand: req.body.productBrand,
    productPrice: req.body.productPrice,
    productName: req.body.productName,
  });
  try {
    const created_product = await product.save();
    const updated_product = await Productschema.findOneAndUpdate(
      //replace productID wuth _id
      {
        _id: created_product._id,
      },
      { productID: created_product._id },
      { new: true }
    );
    const detail = new ProductDetail({
      productID: created_product._id,
      vegan: req.body.vegan === "True" ? true : false,
      vegetarian: req.body.vegetarian === "True" ? true : false,
      fat: req.body.fat,
      sugar: req.body.sugar,
      salt: req.body.salt,
      fatLevel: req.body.fatLevel,
      sugarLevel: req.body.sugarLevel,
      saltLevel: req.body.saltLevel,
      productDescription: req.body.productDescription,
    });
    const created_detail = await detail.save();
    return res.status(200).json({
      message: "Product added successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function updateProduct(req: Request, res: Response) {
  const product = new Productschema({
    productID: req.body.productID,
    category: req.body.category,
    imageUrl: req.body.imageUrl,
    nutriScore: req.body.nutriScore,
    capacity: req.body.capacity,
    productBrand: req.body.productBrand,
    productPrice: req.body.productPrice,
    productName: req.body.productName,
  });
  const detail = new ProductDetail({
    productID: req.body.productID,
    vegan: req.body.vegan === "True" ? true : false,
    vegetarian: req.body.vegetarian === "True" ? true : false,
    fat: req.body.fat,
    sugar: req.body.sugar,
    salt: req.body.salt,
    fatLevel: req.body.fatLevel,
    sugarLevel: req.body.sugarLevel,
    saltLevel: req.body.saltLevel,
    productDescription: req.body.productDescription,
  });

  try {
    const created_product = await Productschema.findOneAndUpdate(
      { productID: req.body.productID },
      {
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        nutriScore: req.body.nutriScore,
        capacity: req.body.capacity,
        productBrand: req.body.productBrand,
        productPrice: req.body.productPrice,
        productName: req.body.productName,
      }
    );
    const created_detail = await ProductDetail.findOneAndUpdate(
      { productID: req.body.productID },
      {
        vegan: req.body.vegan === "True" ? true : false,
        vegetarian: req.body.vegetarian === "True" ? true : false,
        fat: req.body.fat,
        sugar: req.body.sugar,
        salt: req.body.salt,
        fatLevel: req.body.fatLevel,
        sugarLevel: req.body.sugarLevel,
        saltLevel: req.body.saltLevel,
        productDescription: req.body.productDescription,
      }
    );
    return res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}
