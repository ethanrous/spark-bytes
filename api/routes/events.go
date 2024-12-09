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

// GetEventsByOwner godoc
//
// @ID			GetEventsByOwner
//
// @Summary		Get Events By Owner
// @Tags		Events
// @Produce		json
// @Param       owner_id query string true "ID of Event Owner"
// @Success		200 {array} rest.EventInfo
// @Failure		400
// @Failure     401
// @Router		/events/owner [get]
func getEventsByOwner(w http.ResponseWriter, r *http.Request) {
    db := databaseFromContext(r.Context())

    ownerIDStr := r.URL.Query().Get("owner_id")
	var ownerID int
	var err error

	if ownerIDStr == "" {
		ownerID = userFromContext(r.Context()).ID
	} else {
		ownerID, err = strconv.Atoi(ownerIDStr)
        if err != nil {
            http.Error(w, "Invalid owner_id query parameter", http.StatusBadRequest)
            return
        }
	}

    el, err := db.GetEventsByOwner(ownerID)
        if err != nil {
            log.Error.Println("Error getting events by owner: ", err)
            w.WriteHeader(http.StatusInternalServerError)
            return
        }

    eInfoList := rest.LatestEventsList(el)
    writeJson(w, http.StatusOK, eInfoList)
}

// CreateEvent godoc
//
// @ID			CreateEvent
// @Summary		Create a New Event
// @Tags		Events
// @Accept		json
// @Produce		json
// @Param		eventParams			body	rest.NewEventParams    true    "Event params"
// @Success		201
// @Failure		400 "Bad Request"
// @Failure		401 "Unauthorized"
// @Failure		500 "Internal Server Error"
// @Router		/events [post]
func createEvent(w http.ResponseWriter, r *http.Request) {
	newEvent, err := readCtxBody[rest.NewEventParams](w, r)
	if err != nil {
		return
	}

	db := databaseFromContext(r.Context())
	user, err := userFromContext(r.Context())
	if err != nil {
		log.Error.Println("Error getting user from context: ", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	newEvent.OwnerID = user.ID

	err = db.NewEvent(newEvent)
	if err != nil {
		log.Error.Println("Error creating event: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// ModifyEvent godoc
//
// @ID			ModifyEvent
// @Summary		Modify an Existing Event
// @Tags		Events
// @Accept		json
// @Produce		json
// @Param		id path int true "Event ID"
// @Param		event body rest.NewEventParams true "Updated event details"
// @Success		200 "Event modified successfully"
// @Failure		400 "Invalid Event ID or Bad request"
// @Failure		401 "Unauthorized"
// @Failure		403 "Forbidden - Not the event owner"
// @Failure		500 "Internal Server Error"
// @Router		/events/{id} [put]
func modifyEvent(w http.ResponseWriter, r *http.Request) {
	newEvent, err := readCtxBody[rest.NewEventParams](w, r)
	if err != nil {
		return
	}

	eventIDStr := chi.URLParam(r, "id")
	eventID, err := strconv.Atoi(eventIDStr)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
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

	err = db.ModifyEvent(eventID, newEvent)
	if err != nil {
		log.Error.Println("Error creating event: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// ReserveEvent godoc
//
// @ID			ReserveEvent
// @Summary		Reserve a Spot in an Event
// @Tags		Events
// @Produce		json
// @Param		id path int true "Event ID"
// @Success		201 {object} map[string]string "Reservation created successfully"
// @Failure		400 "Invalid Event ID"
// @Failure		401 "Unauthorized"
// @Failure     409 "You already have a reservation for this event"
// @Failure		500 "Internal Server Error"
// @Router		/events/{id}/reservations [post]
func reserveEvent(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "id")
	eventID, err := strconv.Atoi(eventIDStr)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	db := databaseFromContext(r.Context())
	user, err := userFromContext(r.Context())
	if err != nil {
		log.Error.Println("Error getting user from context: ", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// Check if reservation already exists
    exists, err := db.ReservationExists(user.ID, eventID)
    if err != nil {
        log.Error.Println("Error checking reservation:", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

    if exists {
        // The user already has a reservation for this event
        http.Error(w, "You already have a reservation for this event", http.StatusConflict)
        return
    }

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

// RemoveReservationFromCode godoc
//
// @ID			RemoveReservationFromCode
// @Summary		Remove a Reservation by Code
// @Tags		Events
// @Produce		json
// @Param		id path int true "Event ID"
// @Param		code query string true "Reservation code"
// @Success		200 {object} map[string]string "Reservation cleared successfully"
// @Failure		400 "Invalid request or missing code"
// @Failure		401 "Unauthorized"
// @Failure		403 "Forbidden - Not the event owner"
// @Failure		404 "Reservation not found"
// @Failure		500 "Internal Server Error"
// @Router		/events/{id}/reservations [patch]
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
	user, err := userFromContext(r.Context())
	if err != nil {
		log.Error.Println("Error getting user from context: ", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

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

// RemoveReservationFromUser godoc
//
// @ID			RemoveReservationFromUser
// @Summary		Remove the Authenticated User's Reservation
// @Tags		Events
// @Produce		json
// @Param		id path int true "Event ID"
// @Success		200 {object} map[string]string "Reservation cleared successfully"
// @Failure		400 "Invalid Event ID"
// @Failure		401 "Unauthorized"
// @Failure		500 "Internal Server Error"
// @Router		/events/{id}/reservations [delete]
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
