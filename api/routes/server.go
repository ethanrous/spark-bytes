package routes

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Server struct{ r *chi.Mux }

// @title						SparkBytes API
// @version					1.0
// @description				Access to the SparkBytes server
// @host						localhost:5001
// @schemes					http https
// @BasePath					/api/
//
// @securityDefinitions.apikey	SessionAuth
// @in							cookie
// @name						spark-bytes-session
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
		AllowedHeaders:   []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With", "Content-Range", "Cookie"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	r.Route("/api", func(r chi.Router) {
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
	})

	r.Mount("/", UseUi())

	return &Server{r: r}
}

func UseUi() *chi.Mux {
	memFs := &InMemoryFS{routes: make(map[string]*memFileReal, 10), routesMu: sync.RWMutex{}, proxyAddress: "http://localhost:5001", baseDir: "../client/out"}
	memFs.loadIndex()

	r := chi.NewMux()
	r.Route("/assets", func(r chi.Router) {
		r.Use(func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Cache-Control", "public, max-age=3600")
				// w.Header().Set("Content-Encoding", "gzip")
				next.ServeHTTP(w, r)
			})
		})
		r.Handle("/*", http.FileServer(memFs))
	})
	r.Route("/_next", func(r chi.Router) {
		r.Use(func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Cache-Control", "public, max-age=3600")
				// w.Header().Set("Content-Encoding", "gzip")
				next.ServeHTTP(w, r)
			})
		})
		r.Handle("/*", http.FileServer(memFs))
	})

	r.NotFound(
		func(w http.ResponseWriter, r *http.Request) {
			if !strings.HasPrefix(r.RequestURI, "/api") {
				fmt.Printf("Could not find route for %s, serving index\n", r.RequestURI)
				_, err := w.Write(memFs.index.data)
				if err != nil {
					log.Println("Error writing response: ", err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}

			} else {
				w.WriteHeader(http.StatusNotFound)
				return
			}
		},
	)

	return r
}

func (s *Server) Start(port int) error {
	portStr := fmt.Sprintf("0.0.0.0:%d", port)
	log.Println("Server is starting on ", portStr)
	return http.ListenAndServe(portStr, s.r)
}
