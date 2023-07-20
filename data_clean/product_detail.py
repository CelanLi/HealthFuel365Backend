import pandas as pd
import product

# map for the productdetail schema
def map_columns_name(input_csv_file, output_csv_file):
    df = pd.read_csv(input_csv_file)
    df = product.filter(df)
    # rename the column "code" to "productID"
    df.rename(columns={"code": "productID"}, inplace=True)
    # create new columns for fat, sugar, and salt levels and corresponding values
    df["fatLevel"] = "low"
    df["fat"] = df["fat_value"]
    df["sugarLevel"] = "low"
    df["sugar"] = df["sugars_value"]
    df["saltLevel"] = "low"
    df["salt"] = df["salt_value"]
    # set "vegan" and "vegetarian" columns to True if corresponding labels exist in "labels" column, otherwise False
    df["vegan"] = df["labels"].str.contains("Vegan", case=False)
    df["vegetarian"] = df["labels"].str.contains("Vegetarisch", case=False)
    # ---------- Generate the "productDescription" by combining various nutrition-related columns--------------
    description_string = ""
    ## ingredients
    ingredients = "Ingredients: " + df["ingredients_text_en"] + "; "
    ## allergens
    df["allergens_tags"] = df["allergens_tags"].apply(
        lambda tags: ", ".join(
            [tag.split(":")[1] for tag in tags.split(",") if "en:" in tag]
        )
        if isinstance(tags, str)
        else tags
    )
    allergens = df["allergens_tags"].apply(
        lambda tags: "Allergens: " + tags.title() + "; "
        if isinstance(tags, str) and tags
        else ""
    )

    ## nova
    nova = "Nova: " + df["off:nova_groups"].astype(str) + "; "

    ## used for nutritional table 
    '''
    Calculate the energy column based on energy-kj_value and energy-kcal_value
    If both values are not null, combine them as "kj (kcal)"
    If energy-kj_value is null and energy-kcal_value is not null, display only the "kcal" value
    If energy-kj_value is not null and energy-kcal_value is null, display only the "kj" value
    '''
    df["energy"] = df.apply(
        lambda row: str(row["energy-kj_value"])
        + " kj"
        + " ("
        + str(row["energy-kcal_value"])
        + " kcal)"
        if not pd.isnull(row["energy-kj_value"])
        and not pd.isnull(row["energy-kcal_value"])
        else str(row["energy-kcal_value"]) + " kcal"
        if pd.isnull(row["energy-kj_value"]) and not pd.isnull(row["energy-kcal_value"])
        else str(row["energy-kj_value"]) + " kj"
        if not pd.isnull(row["energy-kj_value"])
        else "",
        axis=1,
    )
    energy = "Energy: " + df["energy"] + "; "
    ### create columns for fat, sugar, fiber, proteins, and salt, along with their respective units
    fat = "Fat: " + df["fat_value"].astype(str) + df["fat_unit"] + "; "
    sugar = "Sugar: " + df["sugars_value"].astype(str) + df["sugars_unit"] + "; "
    fiber = "Fiber: " + df["fiber_value"].astype(str) + df["fiber_unit"] + "; "
    proteins = (
        "Proteins: " + df["proteins_value"].astype(str) + df["proteins_unit"] + "; "
    )
    salt = "Salt: " + df["salt_value"].astype(str) + df["salt_unit"] + ";"
    ### combine the nutrition values into one string
    description_string = (
        description_string
        + ingredients
        + allergens
        + nova
        + energy
        + fat
        + sugar
        + fiber
        + proteins
        + salt
    )
    df["productDescription"] = description_string
    # ----------------------------------------------
    # Keep only selected columns in the DataFrame
    selected_columns = [
        "productID",
        "fatLevel",
        "fat",
        "sugarLevel",
        "sugar",
        "saltLevel",
        "salt",
        "vegan",
        "vegetarian",
        "productDescription",
    ]
    df = df[selected_columns]
    df.to_csv(output_csv_file, index=False)