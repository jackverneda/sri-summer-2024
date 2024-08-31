import pandas as pd
import numpy as np
import json
import sklearn

df = pd.read_csv('/content/drive/MyDrive/Colab Notebooks/beauty2vec.csv')
df.head()

items = df.reset_index()
items = items.set_index('parent_asin')
items.head()


with open('/content/drive/MyDrive/Colab Notebooks/seq.json', 'r') as f:
  seqs = json.load(f)
# print(seqs)


def padding(items: list, n: int = 3):
    padded_embeddings = np.full(n, -1)
    seq_len = min(len(items), n)
    padded_embeddings[n-seq_len:] = items[-seq_len:]
    return padded_embeddings


raw_data = [[items.loc[p['parent_asin']]['index'] for p in seq if p['parent_asin']] for _,seq in seqs.items()]
print(raw_data[0][0])
# raw_data = tf.keras.utils.pad_sequences(raw_data, maxlen=3)
raw_data = [padding(seq) for seq in raw_data]

from sklearn.model_selection import train_test_split

X = np.array([seq[:2] for seq in raw_data])
y = np.array([np.zeros(112590) for seq in raw_data])
for i,seq in enumerate(raw_data):
  y[i][seq[2]]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout

# Parámetros del modelo
num_items = 112590  # Número total de ítems
embedding_dim = 128
hidden_dim = 256
num_layers = 2
dropout_rate = 0.3

# Construcción del modelo
model = Sequential()
model.add(Embedding(input_dim=num_items, output_dim=embedding_dim))

# Añadir múltiples capas LSTM
for _ in range(num_layers - 1):
    model.add(LSTM(hidden_dim, return_sequences=True))
    model.add(Dropout(dropout_rate))

# Última capa LSTM sin return_sequences
model.add(LSTM(hidden_dim))
model.add(Dropout(dropout_rate))

# Capa de salida
model.add(Dense(num_items, activation='softmax'))

# Compilación del modelo
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Resumen del modelo
model.summary()

# Entrenamiento del modelo (suponiendo que ya tienes los datos)
model.fit(X_train, y_train, epochs=10, batch_size=32, validation_split=0.2)

# Evaluación del modelo
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Loss: {loss}, Test Accuracy: {accuracy}")

# Predicción del siguiente ítem
# next_item = model.predict(test_sequence)


