import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";
import {
  getShoppingCart,
  deleteProduct,
  changeProductQuantity,
} from "../services/shoppingCartService";

export async function getShoppingCartList(req: Request, res: Response) {
  const { shoppingCartID } = req.query;
  try {
    if (!shoppingCartID || typeof shoppingCartID != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing query parameter shoppingCartID"));
    }
    const shoppingCartItems = await getShoppingCart(shoppingCartID);
    return res.status(200).send(shoppingCartItems);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function deleteProductItem(req: Request, res: Response) {
  const { shoppingCartID, productID } = req.body;
  try {
    //error
    if (!shoppingCartID || typeof shoppingCartID != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing body parameter shoppingCartID"));
    } else if (!productID || typeof productID != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing body parameter productID"));
    }

    await deleteProduct(shoppingCartID, productID);
    return res.status(200).send("");
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function changeProductCount(req: Request, res: Response) {
  let { shoppingCartID, productID, quantity } = req.body;
  try { 
    //error
    if (!shoppingCartID || typeof shoppingCartID != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing body parameter shoppingCartID"));
    } else if (!productID || typeof productID != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing body parameter productID"));
    } else if (typeof quantity != "number" || `${quantity}`.includes('.') ||quantity < 1) {
      return res
        .status(400)
        .json(
          badRequestErrorMessage("Missing body parameter product quantity")
        );
    }

    await changeProductQuantity(shoppingCartID, productID, quantity);
    return res.status(200).send("");
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}
