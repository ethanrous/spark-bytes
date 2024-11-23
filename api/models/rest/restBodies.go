package rest

import "time"

type NewUserParams struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
} // @name NewUserParams

type LoginParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
} // @name LoginParams

type NewEventParams struct {
	Name        string    `json:"name"`
	Location    string    `json:"location"`
	Description string    `json:"description"`
	DietaryInfo string    `json:"dietary_info"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	OwnerID     int       `json:"owner_id"`
} // @name NewEventParams
