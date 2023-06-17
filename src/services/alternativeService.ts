import ProductSchema, { ProductInterface } from "../models/product";

export const findAlternative = async (
 /* to do: alternative algorithm*/
  selectedItem: string
): Promise<ProductInterface[] | null> => {
  console.log("selected item: " + selectedItem );
  if (selectedItem === "1") {
    return await ProductSchema.find({
     nutriScore: "A"
    })
  } 
  else return await ProductSchema.find({
    nutriScore: "B"
   })
};
