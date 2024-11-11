CREATE DATABASE sparkbytes_db;
\c sparkbytes_db

CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT NOW()
);
COPY users(first_name, last_name, email, password_hash, is_verified)
FROM '/docker-entrypoint-initdb.d/example_users.csv' DELIMITER ',' CSV HEADER;