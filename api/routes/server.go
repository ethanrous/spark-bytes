package routes

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Server struct{ r *chi.Mux }

func NewServer(db database.Database) *Server {

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(WithDb(db))
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		_, err := w.Write([]byte("pong"))
		if err != nil {
			log.Println("Error writing response: ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	r.Route("/users", func(r chi.Router) {
		r.Get("/", getUser)
		r.Post("/", createUser)
		r.Post("/login", loginUser)
	})

	r.Route("/events", func(r chi.Router) {
		r.Get("/", getEvents)
		r.Post("/", createEvent)
	})

	return &Server{r: r}
}

func (s *Server) Start(port int) error {
	portStr := fmt.Sprintf("0.0.0.0:%d", port)
	log.Println("Server is starting on ", portStr)
	return http.ListenAndServe(portStr, s.r)
}
