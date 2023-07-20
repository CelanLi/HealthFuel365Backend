import pandas as pd

# used to transform the format and drop unneccessary columns and NAs


def remove_columns_and_export(xlsx_file, columns_to_keep, columns_non_empty, csv_file):
    # read xlsx file to df
    df = pd.read_excel(xlsx_file)

    # only save colums we need
    df = df[columns_to_keep]

    # delete rows
    # neccessary information must be not empty
    df = df.dropna(subset=columns_non_empty, how='any')

    # export to csv file
    df.to_csv(csv_file, index=False)


columns_to_keep = ['code', 'lc', 'product_name_en', 'quantity', 'serving_size',
                   'brands', 'brands_tags', 'categories', 'categories_tags',
                   'labels', 'labels_tags', 'countries', 'countries_tags',
                   'ingredients_text_en', 'allergens', 'allergens_tags',
                   'energy-kj_value', 'energy-kj_unit', 'energy-kcal_value', 'energy-kcal_unit',
                   'fat_value', 'fat_unit', 'sugars_value', 'sugars_unit',
                   'fiber_value', 'fiber_unit', 'proteins_value', 'proteins_unit',
                   'salt_value', 'salt_unit', 'link',
                   'off:food_groups', 'off:nova_groups', 'off:nova_groups_tags', 'off:nutriscore_grade',
                   'off:nutriscore_score', 'data_sources'
                   ]

columns_non_empty = ['code', 'product_name_en', 'brands', 'categories', 'fat_value', 'fat_unit',
                     'sugars_value', 'sugars_unit', 'salt_value', 'salt_unit', 'off:nutriscore_grade']

# map for the product schema


def map_columns_name(input_csv_file, output_csv_file, brandName):
    df = pd.read_csv(input_csv_file)
    # filter
    df = filter(df)
    # rename columns "code" to "productID" and "brands" to "productBrand"
    df.rename(columns={"code": "productID",
              "brands": "productBrand"}, inplace=True)
    # set "productBrand" column to the provided brand name
    df["productBrand"] = brandName
    # merge "product_name_en", "brands", and "quantity" into "productName"
    df["productName"] = (
        df["product_name_en"]
        .str.cat(df["productBrand"], sep=" - ")
        .str.cat(df["quantity"], sep=" - ")
    )
    # add a new column "productPrice" with a default value of 2.99
    df["productPrice"] = 2.99
    # add a new column "capacity" with a default value of 100
    df["capacity"] = 100
    #  Map "categories" column to "category" ("snacks/staple/drinks/flavorings")
    df["category"] = df["categories"].map(category_mapping)
    # Convert "off:nutriscore_grade" to uppercase and store it in "nutriScore" column
    df["nutriScore"] = df["off:nutriscore_grade"].str.upper()
    # Add an empty "imageUrl" column, wait for join
    df["imageUrl"] = ""
    # Keep only selected columns in the DataFrame
    selected_columns = [
        "productID",
        "productName",
        "productPrice",
        "capacity",
        "category",
        "nutriScore",
        "productBrand",
        "imageUrl",
    ]
    df = df[selected_columns]
    df.to_csv(output_csv_file, index=False)

# Hilfer method for map_columns_name(input_csv_file, output_csv_file, brandName)


def category_mapping(categories):
    if (
        "Snacks" in categories
        or "Imbiss" in categories
        or "Reiswaffeln" in categories
        or "Würste" in categories
    ):
        return "snacks"
    elif (
        "Getränke" in categories
        or "Beverages" in categories
        or "Säfte" in categories
        or "Milch" in categories
    ):
        return "drinks"
    elif (
        "Müslis" in categories
        or "Getreide und Kartoffeln" in categories
        or "Cereals and potatoes" in categories
        or "Breakfasts" in categories
        or "Rices" in categories
        or "Seeds" in categories
    ):
        return "staple"
    elif (
        "Saucen" in categories
        or "Gewürzmittel" in categories
        or "Condiments" in categories
        or "Sauces" in categories
    ):
        return "flavorings"
    else:
        return "unknown"


def formatOpenFoodFactsData(
    df_csv1, output_csv_file, index=False
):  # format the data from openfoodfacts into the format consistent to the model in mongodb
    df = pd.read_csv(df_csv1, dtype=str)
    df.rename(
        columns={
            "_id": "productID",
            "ingredients_analysis_tags[1]": "vegan",
            "ingredients_analysis_tags[2]": "vegetarian",
        },
        inplace=True,
    )
    df1 = df[["productID", "vegan", "vegetarian"]]
    df1["salt_level"] = df["nutrient_levels.salt"]
    df1["sugar_level"] = df["nutrient_levels.sugars"]
    df1["fat_level"] = df["nutrient_levels.fat"]
    print(df.columns)
    df1["imageUrl"] = df.apply(generate_image_url, axis=1)
    df1.to_csv(output_csv_file, index=False)


def generate_image_url(row):  # use the following rules to get possibile imageurl
    # most imageurl are based on the ean (barcode) and rev
    ean = row["productID"]
    rev = row["images.front_de.rev"]
    if type(rev) != str:
        rev = str(rev)
    if len(rev) != 0:
        image_url = ""
        if len(ean) == 8:
            image_url = (
                "https://world.openfoodfacts.org/images/products/"
                + ean
                + "/front_de."
                + rev
                + "."
                + "400"
                + ".jpg"
            )
        elif len(ean) == 13:
            image_url = (
                "https://world.openfoodfacts.org/images/products/"
                + ean[:3]
                + "/"
                + ean[3:6]
                + "/"
                + ean[6:9]
                + "/"
                + ean[9:13]
                + "/front_de."
                + rev
                + "."
                + "400"
                + ".jpg"
            )
    return image_url


def join_column_name(csv_file1, csv_file2, output_csv_file):
    df1 = pd.read_csv(csv_file1, dtype=str)
    df2 = pd.read_csv(csv_file2, dtype=str)
    df2 = df2.drop(["imageUrl"], axis=1)
    dropColumns = [
        "vegan",
        "vegetarian",
        "salt_level",
        "sugar_level",
        "fat_level",
    ]  # remove unnecessary columns
    merged_df = pd.merge(df1, df2, on="productID")
    merged_df_final = merged_df.drop(dropColumns, axis=1)
    merged_df_final.to_csv(output_csv_file, index=False)
