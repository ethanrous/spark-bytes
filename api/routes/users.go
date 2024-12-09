package routes

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/ethanrous/spark-bytes/internal/log"
	"github.com/ethanrous/spark-bytes/mail"
	"github.com/ethanrous/spark-bytes/models"
	"github.com/ethanrous/spark-bytes/models/rest"
	"github.com/go-chi/chi/v5"
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
		log.Error.Println("Invalid email: ", newUser.Email)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	db := databaseFromContext(r.Context())

	passHashBytes, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), 11)
	if err != nil {
		log.Error.Println("Error hashing password: ", err)
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
		log.Error.Println("Error creating user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	user, err = db.GetUserByEmail(user.Email)
	if err != nil {
		log.Error.Println("Error getting new user info", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = mail.SendVerificationEmail(user)
	if err != nil {
		log.Error.Println("Error sending verification email: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// GetUser godoc
//
// @ID			GetUser
//
// @Summary		Get User
// @Tags		Users
// @Produce		json
// @Param		email	query	string	true	"User email"
// @Success		200 {object} rest.UserInfo
// @Failure		401
// @Router		/users [get]
func getUser(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")

	db := databaseFromContext(r.Context())

	u, err := db.GetUserByEmail(email)
	if err != nil {
		log.Error.Println("Error getting user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	uInfo := rest.NewUserInfo(u)
	writeJson(w, http.StatusOK, uInfo)
}

// GetLoggedInUser godoc
//
// @ID			GetLoggedInUser
//
// @Summary		Get Logged in user
// @Tags		Users
// @Produce		json
// @Success		200 {object} rest.UserInfo
// @Failure		401
// @Router		/users/me [get]
func getLoggedInUser(w http.ResponseWriter, r *http.Request) {
	u, err := userFromContext(r.Context())
	if err != nil {
		log.Error.Println("Error getting user from context: ", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	uInfo := rest.NewUserInfo(u)
	writeJson(w, http.StatusOK, uInfo)
}

// VerifyUser godoc
//
// @ID			VerifyUser
//
// @Summary		Verify a user
// @Tags		Users
// @Produce		json
// @Success		200
//
// @Param		userId	path		string	true	"UserId to verify"
//
// @Failure		404
// @Router		/users/{userId}/verify [post]
func verifyUser(w http.ResponseWriter, r *http.Request) {
	db := databaseFromContext(r.Context())
	// u, err := userFromContext(r.Context())
	// if err != nil {
	// 	log.Error.Println("Error getting user from context: ", err)
	// 	w.WriteHeader(http.StatusUnauthorized)
	// 	return
	// }

	userId := chi.URLParam(r, "userId")
	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		log.Error.Println("Error verifying user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = db.VerifyUser(userIdInt)
	if err != nil {
		log.Error.Println("Error verifying user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

type WlClaims struct {
	ID int `json:"id"`
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
//	@Success	200 {object} rest.UserInfo
//	@Failure	401
//	@Router		/users/login [post]
func loginUser(w http.ResponseWriter, r *http.Request) {
	log.Info.Println("Login user")
	login, err := readCtxBody[rest.LoginParams](w, r)
	if err != nil {
		return
	}

	db := databaseFromContext(r.Context())

	u, err := db.GetUserByEmail(login.Email)
	if err != nil {
		if errors.Is(err, database.ErrUserNotFound) {
			log.Error.Println("User not found: ", err)
			w.WriteHeader(http.StatusNotFound)
			return
		}
		log.Error.Println("Error getting user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if !u.IsVerified {
		log.Error.Println("User not verified")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(login.Password))
	if err != nil {
		log.Error.Println("Error comparing password: ", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	expires := time.Now().Add(time.Hour * 24 * 7)
	claims := WlClaims{
		u.ID,
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
	writeJson(w, http.StatusOK, rest.NewUserInfo(u))
}

// LogoutUser godoc
//
//	@ID		LogoutUser
//
//	@Summary	Logout User
//	@Tags		Users
//	@Success	200
//	@Router		/users/logout [post]
func logoutUser(w http.ResponseWriter, r *http.Request) {
	cookie := fmt.Sprintf("%s=;Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT;HttpOnly", "spark-bytes-session")
	w.Header().Set("Set-Cookie", cookie)
	w.WriteHeader(http.StatusOK)
}
