import os
import numpy as np

DATA_DIR = '../data'

X, y = [], []

for label in os.listdir(DATA_DIR):
    for file in os.listdir(os.path.join(DATA_DIR, label)):
        path = os.path.join(DATA_DIR, label, file)

        seq = np.load(path)

        if seq.shape == (30, 42):
            X.append(seq)
            y.append(int(label))

X = np.array(X)
y = np.array(y)

np.save("../X.npy", X)
np.save("../y.npy", y)

print("Dataset shape:", X.shape)