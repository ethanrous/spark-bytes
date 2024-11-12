package models

import "time"

type User struct {
	ID         int       `db:"id"`
	Email      string    `db:"email"`
	Password   string    `db:"password_hash"`
	FirstName  string    `db:"first_name"`
	LastName   string    `db:"last_name"`
	IsVerified bool      `db:"is_verified"`
	JoinedAt   time.Time `db:"joined_at"`
}
