import * as mongoose from "mongoose";

interface MatrixColumnInterface {
  productId : string;
  similarity: number;
}

export interface ItemSimilarityMatrixInterface extends mongoose.Document {
  productId: string;
  matrixColumn: MatrixColumnInterface[];
}

export const ItemSimilarityMatrixSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  matrixColumn:[{
    productId: {
      type: String,
      required: true,
    },
    similarity: {
      type: Number,
      required: true,
    },
  }]
});

export default mongoose.model<ItemSimilarityMatrixInterface>('ItemSimilarityMatrix', ItemSimilarityMatrixSchema);
