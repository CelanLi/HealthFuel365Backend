import * as mongoose from "mongoose";
import product, { ProductInterface } from "./product";

export interface RecommendationInterface extends mongoose.Document {
  userId: string;
  recommendationList: { productID: string }[];
}

export interface RecommendationList {
  productID: string;
}

export const RecommendationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  recommendationList:{
    type: [{
        productID: {
          type: String,
          required: true,
        },
      }],
      required: true,
  }
});

export default mongoose.model<RecommendationInterface>('Recommendation', RecommendationSchema);