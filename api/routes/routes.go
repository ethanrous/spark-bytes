package routes

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/go-chi/render"
)

type ContextKey string

const (
	DBKey ContextKey = "database"
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
