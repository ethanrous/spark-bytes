package routes

import (
	"log"
	"net/http"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func StatusErr(w http.ResponseWriter, r *http.Request, msg string, status int) {
	if status < 400 {
		panic("StatusErr() called with status < 400")
	}

	w.WriteHeader(status)
	render.JSON(w, r, map[string]string{"error": msg})
}

func SearchByKeyword(w http.ResponseWriter, r *http.Request) {
	keyword := chi.URLParam(r, "keyword")
	if keyword == "" {
		StatusErr(w, r, "Missing keyword", http.StatusBadRequest)
		return
	}
	log.Println("Searching for: ", keyword)

	products, err := database.SearchByKeyword(keyword)
	if err != nil {
		log.Println("Error: ", err)
		StatusErr(w, r, err.Error(), http.StatusBadRequest)
		return
	}

	log.Println("Products found: ", len(products))

	render.JSON(w, r, map[string]any{"products": products})
}
