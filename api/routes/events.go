package routes

import (
	// "fmt"
	"fmt"
	"log"
	"net/http"
	"strconv"

	// "strings"
	// "time"
	// "github.com/ethanrous/spark-bytes/models"

	"github.com/ethanrous/spark-bytes/models/rest"
	"github.com/go-chi/chi"
	"github.com/golang-jwt/jwt/v5"
	// "github.com/golang-jwt/jwt/v5"
)

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
		log.Println("Error creating event: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func reserveEvent(w http.ResponseWriter, r *http.Request) {
    eventIDStr := chi.URLParam(r, "id")
    eventID, err := strconv.Atoi(eventIDStr)
    if err != nil {
        http.Error(w, "Invalid event ID", http.StatusBadRequest)
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

    // Generate random 4-digit code for user to present to event staff
    code, err := db.GenerateReserveCode()
    if err != nil {
        log.Println("Error generating unique code:", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

    // Insert the reservation record into the database
    err = db.CreateReservation(claims.ID, eventID, code)
    if err != nil {
        log.Println("Error creating reservation:", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

    // Return the code or a success message
    w.WriteHeader(http.StatusCreated)
    writeJson(w, http.StatusCreated, map[string]string{
        "message": "Reservation created successfully",
        "code":    code,
    })
}