import pandas as pd

def merged_all_product (csv_file, price_file):
    merged_data = pd.read_csv(csv_file)
    data_with_price = pd.read_csv(price_file)

    merged_data = pd.merge(merged_data, data_with_price[['productID', 'productPrice', 'category']], on='productID', how='left')

    merged_data.rename(columns={'productPrice_y': 'productPrice', 'category_y': 'category'}, inplace=True)

    merged_data.drop(['productPrice_x',  'category_x'], axis=1, inplace=True)

    merged_data.to_csv("all_product_with_price.csv", index=False)
