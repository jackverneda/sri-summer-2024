import tensorflow as tf
import numpy as np
import pandas as pd
import json

from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense, LSTM, GRU

ppoints = pd.read_csv('/content/drive/MyDrive/Colab Notebooks/emb.csv').T
ppoints = ppoints.iloc[1:]
with open('/content/drive/MyDrive/Colab Notebooks/seq.json', 'r') as f:
  seqs = json.load(f)

def padding(embeddings: list, n: int = 3):
    embedding_dim = len(embeddings[0])
    padded_embeddings = np.zeros((n, embedding_dim))
    seq_len = min(len(embeddings), n)
    padded_embeddings[n-seq_len:] = embeddings[-seq_len:]
    return padded_embeddings



raw_data = [[np.array(ppoints.loc[p['parent_asin']]) for p in seq if p['parent_asin']] for _,seq in seqs.items()]
raw_data = [padding(seq) for seq in raw_data]


X = np.array([seq[:2] for seq in raw_data])
y = np.array([np.array([seq[2]]) for seq in raw_data])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = Sequential([
    GRU(512, return_sequences=False, input_shape=(2, 312)),  
    # LSTM(512, return_sequences=False),  
    
    # La salida es otro embedding de tamaño 312
    Dense(312)  
])

# Compilar el modelo
model.compile(optimizer='adam', loss='huber', metrics=['mae', 'mse'])
history = model.fit(X_train, y_train, epochs=10, batch_size=10, validation_split=0.2)

# Evaluar el modelo con datos de prueba
# test_loss, test_mae, test_mse = model.evaluate(X_test, y_test)
# print(f'Test Loss: {test_loss}, Test MAE: {test_mae}, Test MSE: {test_mse}')

model.save('all_beauty-embedding_rnn.keras')