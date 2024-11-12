package rest

import (
	"time"

	"github.com/ethanrous/spark-bytes/models"
)

type UserInfo struct {
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Verified  bool      `json:"verified"`
	JoinedAt  time.Time `json:"joined_at"`
} // @name UserInfo

func NewUserInfo(u models.User) UserInfo {
	return UserInfo{
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		Verified:  u.IsVerified,
		JoinedAt:  u.JoinedAt,
	}
}
