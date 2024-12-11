package routes

import (
	"fmt"
	"net/http"
	"strings"
	"sync"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/ethanrous/spark-bytes/internal/log"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Server struct{ r *chi.Mux }

// @title						SparkBytes API
// @version					1.0
// @description				Access to the SparkBytes server
// @host						localhost:3000
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
	r.Use(AuthCheck)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With", "Content-Range", "Cookie"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	r.Route("/api", func(r chi.Router) {
		r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
			_, err := w.Write([]byte("pong"))
			if err != nil {
				log.Error.Println("Error writing response: ", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
		})

		r.Route("/users", func(r chi.Router) {
			r.Get("/", getUser)
			r.Get("/me", getLoggedInUser)
			r.Post("/", createUser)
			r.Post("/login", loginUser)
			r.Post("/logout", logoutUser)
			r.Post("/{userId}/verify", verifyUser)
		})

		r.Route("/events", func(r chi.Router) {
			r.Get("/", getEvents)
			r.Get("/owner", getEventsByOwner)
			r.Get("/myEvent", getOwnEvent)
			r.Post("/", createEvent)
			r.Route("/{eventId}", func(r chi.Router) {
				r.Get("/", getEvent)
				r.Put("/", modifyEvent)
				r.Post("/reservations", reserveEvent)
				r.Get("/reservations", getEventReservations)
				r.Patch("/reservations", removeReservationFromCode)
				r.Delete("/reservations", removeReservationFromUser)
			})
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
				fmt.Printf("Serving asset %s\n", r.RequestURI)
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
		func(w http.ResponseWriter, req *http.Request) {
			if !strings.HasPrefix(req.RequestURI, "/api") {

				htmlCheck := req.RequestURI
				if questionIndex := strings.Index(htmlCheck, "?"); questionIndex != -1 {
					htmlCheck = htmlCheck[:questionIndex]
				}
				htmlCheck += ".html"
				log.Info.Println("Checking for:", htmlCheck)
				if memFs.Exists(htmlCheck) {
					fData, err := memFs.ReadFile(htmlCheck)
					if err != nil {
						log.Error.Println("Error writing response: ", err)
						w.WriteHeader(http.StatusInternalServerError)
						return
					}

					_, err = w.Write(fData)
					if err != nil {
						log.Error.Println("Error writing response: ", err)
						w.WriteHeader(http.StatusInternalServerError)
						return
					}

					return
				}

				log.Error.Printf("Could not find route for %s, serving index\n", req.RequestURI)
				_, err := w.Write(memFs.index.data)
				if err != nil {
					log.Error.Println("Error writing response: ", err)
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
	log.Info.Println("Server is starting on ", portStr)
	return http.ListenAndServe(portStr, s.r)
}
