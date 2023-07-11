import { ErrorMessage } from "./models/types";
//Configuration variables
export const mongoURI =
  "mongodb+srv://Healthfuel365:HEALTHFUEL365-team33@cluster0.qlftusn.mongodb.net/Healthfuel365";
//"mongodb://127.0.0.1:27017/healthfuel365";
//"mongodb+srv://Healthfuel365:HEALTHFUEL365-team33@cluster0.vc8gcez.mongodb.net/healthfuel365"; //"mongodb://127.0.0.1:27017/healthfuel365";
export const JwtSecret = "very secret secret";
export const imageServer = "http://localhost:5000/api";
export const imageServiceURI = imageServer + "";
export const openFoodFactsProductUri =
  "https://world.openfoodfacts.org/api/v0/product/";
//azure service
// const apiKey = "";
// const endpoint = "";
// export const formRecognizerClient = new FormRecognizerClient(
//   endpoint,
//   new AzureKeyCredential(apiKey)
// );

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
