import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";
import ProductSchema from "../models/product";
import {
  findProductByName,
  findProductByCategory,
  findAllProducts,
} from "../services/productService";
import { json } from "body-parser";

export async function addProduct(req: Request, res: Response) {
  const { product } = req.body;
  try {
    if (!product) {
      return res
        .status(400)
        .json(
          badRequestErrorMessage("No information about the product provided")
        );
    }

    const newProduct = new ProductSchema(product);

    if (!newProduct) {
      return res
        .status(400)
        .json(badRequestErrorMessage("Invalid Product object"));
    }

    await newProduct.save();
    return res.status(200).send({
      message: "Product saved successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getProductsByName(req: Request, res: Response) {
  const { search } = req.query;
  try {
    if (!search || typeof search != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing query parameter name"));
    }
    const products = await findProductByName(search);
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await findAllProducts();
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getProductByCategory(req: Request, res: Response) {
  const { category } = req.query;
  try {
    if (!category || typeof category != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing query parameter category"));
    }

    const products = await findProductByCategory(category);
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}
export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const { product } = req.body;
  try {
    if (!product || id) {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing Context in Body or parameter"));
    }

    const p = ProductSchema.findById(id);
    if (!p) {
      return res
        .status(400)
        .json(
          badRequestErrorMessage(
            `Product with id ${id} does not exist in database`
          )
        );
    }

    const productResponse = ProductSchema.findByIdAndUpdate(product);
    return res.status(200).send(productResponse);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (id) {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing parameter id"));
    }

    ProductSchema.findByIdAndDelete(id);
    return res.status(200).send({
      message: `Deleted product with id ${id} successfully`,
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}
