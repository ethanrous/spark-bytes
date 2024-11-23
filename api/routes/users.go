package routes

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/ethanrous/spark-bytes/models"
	"github.com/ethanrous/spark-bytes/models/rest"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// CreateUser godoc
//
//	@ID		CreateUser
//
//	@Summary	Create User
//	@Tags		Users
//	@Produce	json
//	@Param		newUserParams	body		rest.NewUserParams	true	"New user params"
//	@Success	200
//	@Failure	401
//	@Router		/users [post]
func createUser(w http.ResponseWriter, r *http.Request) {
	newUser, err := readCtxBody[rest.NewUserParams](w, r)
	if err != nil {
		return
	}

	if !strings.HasSuffix(newUser.Email, "@bu.edu") {
		log.Println("Invalid email: ", newUser.Email)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	db := databaseFromContext(r.Context())

	passHashBytes, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), 11)
	if err != nil {
		log.Println("Error hashing password: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	passHash := string(passHashBytes)

	user := models.User{
		FirstName: newUser.FirstName,
		LastName:  newUser.LastName,
		Email:     newUser.Email,
		Password:  passHash,
	}

	err = db.NewUser(user)
	if err != nil {
		log.Println("Error creating user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func getUser(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")

	db := databaseFromContext(r.Context())

	u, err := db.GetUserByEmail(email)
	if err != nil {
		log.Println("Error getting user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	uInfo := rest.NewUserInfo(u)
	writeJson(w, http.StatusOK, uInfo)
}

type WlClaims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

// LoginUser godoc
//
//	@ID			LoginUser
//
//	@Summary	Login User
//	@Tags		Users
//	@Produce	json
//	@Param		loginParams	body		rest.LoginParams	true	"Login params"
//	@Success	200
//	@Failure	401
//	@Router		/users/login [post]
func loginUser(w http.ResponseWriter, r *http.Request) {
	log.Println("Login user")
	login, err := readCtxBody[rest.LoginParams](w, r)
	if err != nil {
		return
	}

	db := databaseFromContext(r.Context())

	u, err := db.GetUserByEmail(login.Email)
	if err != nil {
		if errors.Is(err, database.ErrUserNotFound) {
			log.Println("User not found: ", err)
			w.WriteHeader(http.StatusNotFound)
			return
		}
		log.Println("Error getting user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(login.Password))
	if err != nil {
		log.Println("Error comparing password: ", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	expires := time.Now().Add(time.Hour * 24 * 7)
	claims := WlClaims{
		u.Email,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expires),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte("key"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	cookie := fmt.Sprintf("%s=%s;Path=/;HttpOnly", "spark-bytes-session", tokenString)
	w.Header().Set("Set-Cookie", cookie)
	w.WriteHeader(http.StatusOK)

}
