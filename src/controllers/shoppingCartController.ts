import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";
import { getShoppingCart } from "../services/shoppingCartService";

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
  console.log(req);
  return res.status(200).json({code: 0, msg: 'success'})
}

export async function changeProductCount(req: Request, res: Response) {}

// export async function getProductByCategory(req: Request, res: Response) {
//   const { category } = req.query;
//   try {
//     if (!category || typeof category != "string") {
//       return res
//         .status(400)
//         .json(badRequestErrorMessage("Missing query parameter category"));
//     }

//     const products = await findProductByCategory(category);
//     return res.status(200).send(products);
//   } catch (error) {
//     return res.status(500).json(internalServerErrorMessage);
//   }
// }

//   export async function deleteProduct(req: Request, res: Response) {
//     const { id } = req.params;
//     try {
//       if (id) {
//         return res
//           .status(400)
//           .json(badRequestErrorMessage("Missing parameter id"));
//       }

//       ProductSchema.findByIdAndDelete(id);
//       return res.status(200).send({
//         message: `Deleted product with id ${id} successfully`,
//       });
//     } catch (error) {
//       return res.status(500).json(internalServerErrorMessage);
//     }
//   }
