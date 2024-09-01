-- Crear la base de datos
CREATE DATABASE bazardb;

-- Conectar a la base de datos
\c bazardb

-- Crear la tabla products
CREATE TABLE products (
    main_category TEXT,
    title TEXT,
    average_rating FLOAT,
    rating_number INT,
    features JSON,
    description JSON,
    price NUMERIC,
    images JSON,
    videos JSON,
    store TEXT,
    categories JSON,
    details JSON,
    parent_asin VARCHAR(10) PRIMARY KEY,
    bought_together JSON
);

-- Crear la tabla users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Crear la tabla purchases
CREATE TABLE purchases (
    purchase_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    parent_asin VARCHAR(10) REFERENCES products(parent_asin),
    purchase_timestamp TIMESTAMP NOT NULL
);

-- Crear la tabla embeddings
CREATE TABLE embeddings (
    parent_asin VARCHAR(10) REFERENCES products(parent_asin),
    index INT PRIMARY KEY,
    embedding FLOAT8[]
);