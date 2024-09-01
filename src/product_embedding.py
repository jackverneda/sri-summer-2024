from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim
import pandas as pd


model = SentenceTransformer('jinaai/jina-embedding-t-en-v1')
def get_embeddings():
  """
  Calcula los embeddings de los títulos de productos en un archivo CSV y los guarda en otro archivo CSV.

  Returns
  -------
  None
    Esta función no devuelve ningún valor.

  Raises
  ------
  FileNotFoundError
    Si el archivo 'beauty2vec.csv' no se encuentra en el directorio actual.

  Notes
  -----
  - Esta función asume que el archivo 'beauty2vec.csv' contiene una columna llamada 'title' que contiene los títulos de los productos.
  - Utiliza un modelo pre-entrenado para calcular los embeddings de los títulos.
  - Los embeddings se guardan en un archivo llamado 'emb.csv' en el directorio actual.
  """
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