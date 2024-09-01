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
