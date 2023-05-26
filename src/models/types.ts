import { ProductInterface } from "./product";

export interface ErrorMessage {
  error: string;
  message: string;
}
export interface IProfile {
  goal: string;
  typeOfEater: string;
  dietaryPreferences: string[];
}
export interface IAddress {
  userID: string;
  street: string;
  postCode: number;
  city: string;
  additionalAddress: string;
  tel: string;
  receiver: string;
}
export enum OrderStatus {
  Processing,
  Shipped,
  Delivered,
  Completed,
  Cancelled,
}

export enum EaterType {
  Vegan,
  Vegetarian,
  Omnivore,
}
export enum Nutri {
  A,
  B,
  C,
  D,
  E,
}

export interface ProductItem {
  quantity: number;
  product: ProductInterface;
}

export interface ProdcutDetail {
  fatLevel: number;
  fat: number;
  saltLevel: number;
  salt: number;
  sugarLevel: number;
  sugar: number;
  productDescription: string[];
}
export interface PackagingAndShippingService {
  isDHL: boolean;
  rapidShipping: boolean;
  sendAsAGift: boolean;
}

export interface recommendation {
  recommendationID: string;
  recommendedProducts: ProductInterface[];
}
export interface payment {
  paymentID: string;
  price: number;
  date: Date;
}
