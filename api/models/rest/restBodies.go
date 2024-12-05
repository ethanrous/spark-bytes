package rest

type NewUserParams struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
} // @name NewUserParams

type LoginParams struct {
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
} // @name LoginParams

type NewEventParams struct {
	Name        string `json:"name"`
	Location    string `json:"location"`
	Description string `json:"description"`
	DietaryInfo string `json:"dietary_info"`
	StartTime   int64  `json:"start_time"`
	EndTime     int64  `json:"end_time"`
	OwnerID     int    `json:"owner_id"`
} // @name NewEventParams
