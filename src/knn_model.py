import tensorflow as tf
import numpy as np
import pandas as pd
import json
from sklearn.neighbors import NearestNeighbors
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense, LSTM, GRU
from joblib import dump

ppoints = pd.read_csv('/content/drive/MyDrive/Colab Notebooks/emb.csv').T
ppoints = ppoints.iloc[1:]
ppoints.head()
knn = NearestNeighbors(n_neighbors=10, algorithm='ball_tree')

# Entrenar el modelo con los vectores de embeddings
knn.fit(ppoints)
dump(knn, 'knn_model.joblib')