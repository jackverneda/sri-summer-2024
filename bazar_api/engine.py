from joblib import load
import tensorflow as tf
from keras.models import load_model
from sqlalchemy.orm import Session
import numpy as np
import json
from . import models

_rnn_model =  load_model('./bazar_api/model/all_beauty-embedding_rnn.keras')
_knn_model = load('./bazar_api/model/all_beauty-embedding_knn.joblib')

def suggest_products(db: Session, user_id: str):
    purchases = db.query(models.Purchase).filter(models.Purchase.user_id == user_id).all()
    seq = [ (p.purchase_timestamp, p.parent_asin) for p in purchases]
    seq = sorted(seq)
    # print('\n\n\n',' Secuencia')
    # print(seq,'\n\n\n')
    # seq = ["B01FK1IUIM","B017FYTGHQ"]
    # seq = [get_embedding(db, code) for code in seq]
    seq = [get_embedding(db, code) for _, code in seq]
    seq = padding(seq)

    rnn_prediction = _rnn_model.predict(seq)
    _, knn_prediction = _knn_model.kneighbors(rnn_prediction)
    print('\n\n\n',knn_prediction,'\n\n\n')

    codes = [ get_code(db, code).parent_asin for code in knn_prediction[0]]
    return [get_suggestions(db, code) for code in codes]

def get_embedding(db: Session ,code: str):
    embedding_str = db.query(models.Embedding).filter(models.Embedding.parent_asin == code).first().embedding
    # embedding = list(map(float, embedding_str.split(',')))
    return list(json.loads(embedding_str))

def get_code(db: Session, index: int):
    return db.query(models.Embedding).filter(models.Embedding.index == str(index)).first()

def get_suggestions(db: Session, codes: str):
    return db.query(models.Product).filter(models.Product.parent_asin == codes).first()

def padding(embeddings: list):
    embedding_dim = len(embeddings[0])
    padded_embeddings = np.zeros((1,10, embedding_dim))
    seq_len = min(len(embeddings), 10)
    padded_embeddings[0,10-seq_len:] = embeddings[-seq_len:]
    return padded_embeddings