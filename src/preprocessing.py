import json

import pandas as pd

def sort_dic(x: dict, s: str):
    y = sorted(x, key=lambda x: x['timestamp'])
    return y


def load_dataset_A():
    """
    Carga los conjuntos de datos A desde archivos JSONL y los guarda en archivos CSV.

    Returns:
        None
    """ 
    with open('../data/All_Beauty.jsonl') as f:
        data_inter = [json.loads(line) for line in f.readlines()]

    df_inter = pd.DataFrame(data_inter)
    df_inter.to_csv('../data/beauty.csv', index=False)

    with open('../data/meta_All_Beauty.jsonl') as f:
        data_meta = [json.loads(line) for line in f.readlines()]

    df_meta = pd.DataFrame(data_meta)
    df_meta.to_csv('../data/meta_beauty.csv', index=False)
    df_meta[['parent_asin', 'title']].to_csv('../data/beauty2vec.csv', index=False)


    users = df_inter.groupby('user_id').size().sort_values(ascending=False)
    users = users[users > 1].index

    df_inter = df_inter[ df_inter['user_id'].isin(users) ]
    seq = df_inter.groupby('user_id').apply(lambda x: x[['asin', 'timestamp', 'rating', 'parent_asin']].to_dict(orient='records'))
    seq = seq.apply(sort_dic, 'timestamp')
    with open('seq.json', 'w') as f:
        json.dump(seq.to_dict(), f)



