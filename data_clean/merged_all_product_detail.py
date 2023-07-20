import glob
import pandas as pd

def merged_all_product_detail(csv_file):

    csv_files = glob.glob(csv_file)

    merged_data = pd.DataFrame()
    first_file = True

    for file in csv_files:
        data = pd.read_csv(file)

        if first_file:
            merged_data = pd.concat([merged_data, data], ignore_index=True)
            first_file = False
        else:
            merged_data = pd.concat([merged_data, data.iloc[0:]], ignore_index=True)

    merged_data.to_csv("all_product_detail.csv", index=False)


