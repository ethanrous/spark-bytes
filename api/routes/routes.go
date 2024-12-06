package routes

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/ethanrous/spark-bytes/models"
	"github.com/go-chi/render"
	"github.com/golang-jwt/jwt/v5"
)

type ContextKey string

const (
	DBKey   ContextKey = "database"
	UserKey ContextKey = "user"
)

func WithDb(db database.Database) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r = r.WithContext(context.WithValue(r.Context(), DBKey, db))
			next.ServeHTTP(w, r)
		})
	}
}

func databaseFromContext(ctx context.Context) database.Database {
	db, ok := ctx.Value(DBKey).(database.Database)
	if !ok {
		panic("database not found in context")
	}
	return db
}

func AuthCheck(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		db := databaseFromContext(r.Context())

		cookie, err := r.Cookie("spark-bytes-session")
		if err != nil {
			// Cookie not found, unauthorized access
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString := cookie.Value

		token, err := jwt.ParseWithClaims(tokenString, &WlClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte("key"), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(*WlClaims)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		user, err := db.GetUserByUserId(claims.ID)
		if err != nil {
			log.Println("Error getting user: ", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		r = r.WithContext(context.WithValue(r.Context(), UserKey, user))
		next.ServeHTTP(w, r)
	})
}

func userFromContext(ctx context.Context) models.User {
	user, ok := ctx.Value(UserKey).(models.User)
	if !ok {
		panic("user not found in context")
	}
	return user
}

func StatusErr(w http.ResponseWriter, r *http.Request, msg string, status int) {
	if status < 400 {
		panic("StatusErr() called with status < 400")
	}

	w.WriteHeader(status)
	render.JSON(w, r, map[string]string{"error": msg})
}

func writeJson(w http.ResponseWriter, status int, obj interface{}) {
	bs, err := json.Marshal(obj)
	if err != nil {
		panic(err)
	}
	w.WriteHeader(status)
	_, err = w.Write(bs)
	if err != nil {
		panic(err)
	}
}

func readCtxBody[T any](w http.ResponseWriter, r *http.Request) (obj T, err error) {
	if r.Method == "GET" {
		err = errors.New("trying to get body of get request")
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	jsonData, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		writeJson(w, http.StatusInternalServerError, map[string]any{"error": "Could not read request body"})
		return
	}
	err = json.Unmarshal(jsonData, &obj)
	if err != nil {
		log.Println(err)
		writeJson(w, http.StatusBadRequest, map[string]any{"error": "Request body is not in expected JSON format"})
		return
	}

	return
}

// func SearchByKeyword(w http.ResponseWriter, r *http.Request) {
// 	db := databaseFromContext(r.Context())
// 	keyword := chi.URLParam(r, "keyword")
// 	if keyword == "" {
// 		StatusErr(w, r, "Missing keyword", http.StatusBadRequest)
// 		return
// 	}
// 	log.Println("Searching for: ", keyword)
//
// 	products, err := db.SearchByKeyword(keyword)
// 	if err != nil {
// 		log.Println("Error: ", err)
// 		StatusErr(w, r, err.Error(), http.StatusBadRequest)
// 		return
// 	}
//
// 	log.Println("Products found: ", len(products))
//
// 	render.JSON(w, r, map[string]any{"products": products})
// }
