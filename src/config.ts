import {
  AzureKeyCredential,
  FormRecognizerClient,
} from "@azure/ai-form-recognizer";
import { ErrorMessage } from "./models/types";

import { MongoClient } from "mongodb";
import { Db } from "mongodb";

//Configuration variables
export const mongoURI = "mongodb://nodeApp"; //to be input
export const JwtSecret = "very secret secret";
//export const imageServiceURI = 'http://192.168.178.20:5000/api/receipt'
export const imageServer = "http://localhost:5000/api";
export const imageServiceURI = imageServer + "";
export const openFoodFactsProductUri =
  "https://world.openfoodfacts.org/api/v0/product/";
//azure service
const apiKey = "";
const endpoint = "";
export const formRecognizerClient = new FormRecognizerClient(
  endpoint,
  new AzureKeyCredential(apiKey)
);

export const internalServerErrorMessage = {
  error: "Internal server error",
  message: "Internal server error",
};

export const badRequestErrorMessage = (msg: string): ErrorMessage => {
  return {
    error: "Bad Request",
    message: msg,
  };
};
