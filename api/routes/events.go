package routes

import (
	// "fmt"
	"fmt"
	"log"
	"net/http"

	// "strings"
	// "time"
	// "github.com/ethanrous/spark-bytes/models"

	"github.com/ethanrous/spark-bytes/models/rest"
	"github.com/golang-jwt/jwt/v5"
	// "github.com/golang-jwt/jwt/v5"
)

func createEvent(w http.ResponseWriter, r *http.Request) {
	newEvent, err := readCtxBody[rest.NewEventParams](w, r)
	if err != nil {
		return
	}

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

    newEvent.OwnerID = claims.ID

	err = db.NewEvent(newEvent)
	if err != nil {
		log.Println("Error creating user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func getEvents(w http.ResponseWriter, r *http.Request) {
	db := databaseFromContext(r.Context())

	el, err := db.GetLatestEvents()
	if err != nil {
		log.Println("Error getting event: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	eInfoList := rest.LatestEventsList(el)
	writeJson(w, http.StatusOK, eInfoList)
}
