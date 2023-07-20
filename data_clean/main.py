import pandas as pd

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

xlsx_files = ['brand_alnatura.xlsx', 'brand_belvita.xlsx', 'brand_davert.xlsx',
              'brand_Maggi.xlsx', 'brand_Mutti.xlsx', 'brand_Ricola.xlsx',
              'brand_Seeberger.xlsx', 'brand_Seitenbacher.xlsx']
csv_files = ['brand_alnatura.csv', 'brand_belvita.csv', 'brand_davert.csv',
              'brand_Maggi.csv', 'brand_Mutti.csv', 'brand_Ricola.csv',
              'brand_Seeberger.csv', 'brand_Seitenbacher.csv']

for i in range(len(xlsx_files)):
    xlsx_file = xlsx_files[i]
    csv_file = csv_files[i]

    remove_columns_and_export(xlsx_file, columns_to_keep, columns_non_empty, csv_file)