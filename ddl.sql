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

CREATE TABLE events (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    dietary_info VARCHAR(255),
    owner_id INT REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    attendees INT
);
COPY events(name, location, description, dietary_info, owner_id, start_time, end_time, attendees)
FROM '/docker-entrypoint-initdb.d/example_events.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE reservations (
    user_id INT NOT NULL REFERENCES users(id),
    event_id INT NOT NULL REFERENCES events(id),
    reserve_code VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
COPY reservations(user_id, event_id, reserve_code)
FROM '/docker-entrypoint-initdb.d/example_reservations.csv' DELIMITER ',' CSV HEADER;