package database

import (
	"errors"
	"time"

	"github.com/ethanrous/spark-bytes/models"
)

const usersTable = `
CREATE TABLE IF NOT EXISTS users (
	id SERIAL UNIQUE,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL,
	password_hash TEXT NOT NULL,
	is_verified BOOLEAN NOT NULL,
	joined_at TIMESTAMP NOT NULL
);
`

	var ErrUserNotFound = errors.New("User not found")

func (db Database) NewUser(newUser models.User) error {
	_, err := db.Exec("INSERT INTO users (first_name, last_name, email, password_hash, is_verified, joined_at) VALUES ($1, $2, $3, $4, $5, $6)", newUser.FirstName, newUser.LastName, newUser.Email, newUser.Password, newUser.IsVerified, time.Now())
	if err != nil {
		return err
	}

	return nil
}

func (db Database) GetUserByEmail(email string) (models.User, error) {
	rows, err := db.Queryx("SELECT * FROM users WHERE email=$1 LIMIT 1", email)
	if err != nil {
		return models.User{}, err
	}

	user := models.User{}
	if !rows.Next() {
		return models.User{}, ErrUserNotFound
	}
	err = rows.StructScan(&user)
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}
