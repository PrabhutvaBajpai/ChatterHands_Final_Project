import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

X = np.load("../X.npy")
y = np.load("../y.npy")

model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(30, 42)),
    Dropout(0.2),
    LSTM(32),
    Dense(32, activation='relu'),
    Dense(len(set(y)), activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(X, y, epochs=20, batch_size=16)

model.save("../models/lstm_model.h5")