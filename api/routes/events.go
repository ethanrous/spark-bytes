package routes

import (
	"log"
	"net/http"
	"strconv"

	"github.com/ethanrous/spark-bytes/models/rest"
	"github.com/go-chi/chi"
	// "github.com/golang-jwt/jwt/v5"
)

// GetEvents godoc
//
// @ID			GetEvents
//
// @Summary		Get All Events
// @Tags		Events
// @Produce		json
// @Success		200 {array} rest.EventInfo
// @Failure		401
// @Router		/events [get]
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

// CreateEvent godoc
//
// @ID			CreateEvent
//
// @Summary		Create Event
// @Tags		Events
// @Produce		json
// @Param		newEventParams	body		rest.NewEventParams	true	"New event params"
// @Success		200
// @Failure		401
// @Router		/events [post]
func createEvent(w http.ResponseWriter, r *http.Request) {
	newEvent, err := readCtxBody[rest.NewEventParams](w, r)
	if err != nil {
		return
	}

	db := databaseFromContext(r.Context())
	user := userFromContext(r.Context())

	newEvent.OwnerID = user.ID

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
	user := userFromContext(r.Context())

	// Generate random 4-digit code for user to present to event staff
	reserveCode, err := db.GenerateReserveCode(eventID)
	if err != nil {
		log.Println("Error generating unique code:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Insert the reservation record into the database
	err = db.CreateReservation(user.ID, eventID, reserveCode)
	if err != nil {
		log.Println("Error creating reservation:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Return the code or a success message
	w.WriteHeader(http.StatusCreated)
	writeJson(w, http.StatusCreated, map[string]string{
		"message":     "Reservation created successfully",
		"userID":      strconv.Itoa(user.ID),
		"eventID":     eventIDStr,
		"reserveCode": reserveCode,
	})
}

func removeReservationFromCode(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "id")
	eventID, err := strconv.Atoi(eventIDStr)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	reserveCode := chi.URLParam(r, "reserveCode")

	db := databaseFromContext(r.Context())
	user := userFromContext(r.Context())

	// Insert the reservation record into the database
	err = db.DeleteReservationFromCode(user.ID, eventID, reserveCode)
	if err != nil {
		log.Println("Error creating reservation:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Return the code or a success message
	w.WriteHeader(http.StatusCreated)
	writeJson(w, http.StatusCreated, map[string]string{
		"message":     "Reservation cleared successfully",
		"eventID":     eventIDStr,
		"reserveCode": reserveCode,
	})
}

