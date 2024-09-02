import tensorflow as tf
import numpy as np
import pandas as pd
import json

from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense, LSTM, GRU


def padding(embeddings: list, n: int = 3):
  """
  Pad the input embeddings with zeros to a fixed length.
  Parameters:
    embeddings (list): List of input embeddings.
    n (int): Fixed length of the padded embeddings.
  Returns:
    np.ndarray: Padded embeddings.
  """
  embedding_dim = len(embeddings[0])
  padded_embeddings = np.zeros((n, embedding_dim))
  seq_len = min(len(embeddings), n)
  padded_embeddings[n-seq_len:] = embeddings[-seq_len:]
  return padded_embeddings


def train_rnn():
  """
  Train a recurrent neural network model.
  """
  ppoints = pd.read_csv('../data//emb.csv').T
  ppoints = ppoints.iloc[1:]

  with open('../data/seq.json', 'r') as f:
    seqs = json.load(f)

  raw_data = [[np.array(ppoints.loc[p['parent_asin']]) for p in seq if p['parent_asin']] for _,seq in seqs.items()]
  raw_data = [padding(seq) for seq in raw_data]


  X = np.array([seq[:2] for seq in raw_data])
  y = np.array([np.array([seq[2]]) for seq in raw_data])

  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

  model = Sequential([
    GRU(312, return_sequences=True, input_shape=(2, 312), dropout=0.2),  # Ejemplo con secuencias de longitud 10
    LSTM(312, return_sequences=True, dropout=0.2),  # Ejemplo con secuencias de longitud 10
    GRU(312),
    Dense(312, activation='linear') 
  ])

  # Compilar el modelo
  model.compile(optimizer='adam', loss='huber', metrics=['mae', 'mse'])
  history = model.fit(X_train, y_train, epochs=10, batch_size=10, validation_split=0.2)

  # Evaluar el modelo con datos de prueba
  # test_loss, test_mae, test_mse = model.evaluate(X_test, y_test)
  # print(f'Test Loss: {test_loss}, Test MAE: {test_mae}, Test MSE: {test_mse}')

  model.save('all_beauty-embedding_rnn.keras')

def knn_accuracy(y_true, y_pred, _knn_model, df_index):
    correct_predictions = 0
    print(len(y_true))
    total_predictions = len(y_true)

    for i in range(total_predictions):
        # if i%1000 == 0:
        #   print(i)

        # Encontrar los 10 vectores más cercanos con el modelo KNN
        _, knn_prediction = _knn_model.kneighbors([y_pred[i]])
        _, knn_true = _knn_model.kneighbors([y_true[i]])

        # Obtener los códigos de los productos predichos
        token = df_index.index[df_index['index'] == knn_true[0][0]][0]
        codes = [df_index.index[df_index['index'] == index][0] for index in knn_prediction[0]]

        # Verificar si la respuesta esperada está entre los 10 vectores más cercanos
        if token in codes:
            correct_predictions += 1

    # Calcular la accuracy
    accuracy = correct_predictions / total_predictions
    return accuracy