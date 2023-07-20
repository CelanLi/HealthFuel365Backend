import pandas as pd

# used to transform the format and drop unneccessary columns and NAs
def remove_columns_and_export(xlsx_file, columns_to_keep,columns_non_empty, csv_file):
    # read xlsx file to df
    df = pd.read_excel(xlsx_file)

    # only save colums we need
    df = df[columns_to_keep]

    # delete rows
    # neccessary information must be not empty
    df = df.dropna(subset=columns_non_empty, how='any')

    # export to csv file
    df.to_csv(csv_file, index=False)

columns_to_keep = ['code','lc','product_name_en','quantity','serving_size',
                   'brands','brands_tags','categories','categories_tags',
                   'labels','labels_tags','countries','countries_tags',
                   'ingredients_text_en','allergens','allergens_tags',
                   'energy-kj_value','energy-kj_unit','energy-kcal_value','energy-kcal_unit',
                   'fat_value','fat_unit','sugars_value','sugars_unit',
                   'fiber_value','fiber_unit','proteins_value','proteins_unit',
                   'salt_value','salt_unit','link',
                   'off:food_groups','off:nova_groups','off:nova_groups_tags','off:nutriscore_grade',
                   'off:nutriscore_score','data_sources'
                   ]

columns_non_empty = ['code','product_name_en','brands','categories','fat_value','fat_unit',
                     'sugars_value','sugars_unit','salt_value','salt_unit','off:nutriscore_grade']

# map for the product schema
def map_columns_name(input_csv_file, output_csv_file, brandName):
    df = pd.read_csv(input_csv_file)
    # filter
    df = filter(df)
    # rename columns "code" to "productID" and "brands" to "productBrand"
    df.rename(columns={"code": "productID", "brands": "productBrand"}, inplace=True)
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
