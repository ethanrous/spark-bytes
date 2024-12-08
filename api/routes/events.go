package routes

import (
	"net/http"
	"strconv"

	"github.com/ethanrous/spark-bytes/internal/log"
	"github.com/ethanrous/spark-bytes/models/rest"
	"github.com/go-chi/chi"
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
		log.Error.Println("Error getting event: ", err)
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
		log.Error.Println("Error creating event: ", err)
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
		log.Error.Println("Error generating unique code:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Insert the reservation record into the database
	err = db.CreateReservation(user.ID, eventID, reserveCode)
	if err != nil {
		log.Error.Println("Error creating reservation:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Increment the attendees count now that a reservation was successfully created
    err = db.IncrementAttendeeCount(eventID)
    if err != nil {
        log.Error.Println("Error incrementing attendee count:", err)
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

	reserveCode := r.URL.Query().Get("code")
	if reserveCode == "" {
        http.Error(w, "Missing reservation code", http.StatusBadRequest)
        return
    }

	db := databaseFromContext(r.Context())
	user := userFromContext(r.Context())

	// Check if the user owns the event
    ownerID, err := db.GetEventOwnerID(eventID)
    if err != nil {
        log.Error.Println("Error getting event owner:", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

	if user.ID != ownerID {
        // The user does not own this event
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

	// Delete the reservation record from the database based on the code
	rowsDeleted, err := db.DeleteReservationFromCode(eventID, reserveCode)
	if err != nil {
		log.Error.Println("Error deleting reservation from code:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if rowsDeleted == 0 {
        // No reservation found with that code for this event
        http.Error(w, "Reservation not found", http.StatusNotFound)
        return
    }

	// Decrement the attendees count after a successful deletion
	err = db.DecrementAttendeeCount(eventID)
    if err != nil {
        log.Error.Println("Error decrementing attendee count:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
    }

	// Return the code or a success message
	w.WriteHeader(http.StatusOK)
	writeJson(w, http.StatusOK, map[string]string{
		"message":     "Reservation cleared successfully",
		"eventID":     eventIDStr,
		"reserveCode": reserveCode,
	})
}

func removeReservationFromUser(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "id")
	eventID, err := strconv.Atoi(eventIDStr)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	db := databaseFromContext(r.Context())
	user := userFromContext(r.Context())

	// Delete the reservation record from the database based on the user
	err = db.DeleteReservationFromUser(eventID, user.ID)
	if err != nil {
		log.Error.Println("Error deleting reservation from user:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Return the code or a success message
	w.WriteHeader(http.StatusOK)
	writeJson(w, http.StatusOK, map[string]string{
		"message":     "Reservation cleared successfully",
		"eventID":     eventIDStr,
		"userID":      strconv.Itoa(user.ID),
	})
}
