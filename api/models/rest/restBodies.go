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
