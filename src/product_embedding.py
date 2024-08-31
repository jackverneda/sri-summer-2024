from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim
import pandas as pd


model = SentenceTransformer('jinaai/jina-embedding-t-en-v1')
df = pd.read_csv('beauty2vec.csv')
df['title'] =  df['title'].astype(str)
embeddings = []

for i in range(0, df.shape[0], 1000):
  chunk = model.encode(
      df.iloc[i:min(i+1000, 112590)]['title'].to_list()
  )
  embeddings += zip(list(df.iloc[i:min(i+1000, 112590)]['parent_asin']), chunk)

mapper = { key: list(emb) for key, emb in embeddings}
dict_emb = pd.DataFrame(mapper)
dict_emb.to_csv('emb.csv')