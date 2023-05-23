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
