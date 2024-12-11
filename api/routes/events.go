package routes

import (
	"net/http"
	"strconv"
	"time"

	"github.com/ethanrous/spark-bytes/internal/log"
	"github.com/ethanrous/spark-bytes/mail"
	"github.com/ethanrous/spark-bytes/models"
	"github.com/ethanrous/spark-bytes/models/rest"
	"github.com/go-chi/chi/v5"
)

// GetEvents godoc
//
//	@ID			GetEvents
//
//	@Summary	Get All Events
//	@Tags		Events
//	@Produce	json
//	@Success	200	{array}	rest.EventInfo
//	@Failure	401
//	@Router		/events [get]
func getEvents(w http.ResponseWriter, r *http.Request) {
	db := databaseFromContext(r.Context())

	el, err := db.GetLatestEvents()
	if err != nil {
		log.Error.Println("Error getting event: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	eInfoList := rest.LatestEventsList(el, db)
	writeJson(w, http.StatusOK, eInfoList)
}

// GetEvent godoc
//
//	@ID			GetEvent
//
//	@Summary	Get an Event
//	@Tags		Events
//	@Produce	json
//	@Param		id	path	int	true	"ID of Event"
//	@Success	200	{object}	rest.EventInfo
//	@Failure	401
//	@Router		/events/{eventId} [get]
func getEvent(w http.ResponseWriter, r *http.Request) {
	db := databaseFromContext(r.Context())

	eventIDStr := chi.URLParam(r, "eventId")
	if eventIDStr == "" {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}
	eventId, err := strconv.Atoi(eventIDStr)
	if err != nil {
		log.Error.Println("Error converting event ID to int: ", err)
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	event, err := db.GetEventById(eventId)
	if err != nil {
		log.Error.Println("Error getting event: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	eventInfo := rest.NewEventInfo(event, db)
	writeJson(w, http.StatusOK, eventInfo)
}

// GetEventsByOwner godoc
//
//	@ID			GetEventsByOwner
//
//	@Summary	Get Events By Owner
//	@Tags		Events
//	@Produce	json
//	@Param		owner_id	query	string	true	"ID of Event Owner"
//	@Success	200			{array}	rest.EventInfo
//	@Failure	400
//	@Failure	401
//	@Router		/events/owner [get]
func getEventsByOwner(w http.ResponseWriter, r *http.Request) {
	db := databaseFromContext(r.Context())

	ownerIDStr := r.URL.Query().Get("owner_id")
	var ownerID int

	user, err := userFromContext(r.Context())
	if err != nil {
		log.Error.Println("Error getting user from context: ", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if ownerIDStr == "" {
		ownerID = user.ID
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

	eInfoList := rest.LatestEventsList(el, db)
	writeJson(w, http.StatusOK, eInfoList)
}

// GetOwnEvent godoc
//
//	@ID			GetOwnEvent
//
//	@Summary	Get Event of Session Cookie Holder
//	@Tags		Events
//	@Produce	json
//	@Success	200			{array}	rest.EventInfo
//	@Failure	400
//	@Failure	401
//	@Router		/events/myEvent [get]
func getOwnEvent(w http.ResponseWriter, r *http.Request) {
	db := databaseFromContext(r.Context())

	user, err := userFromContext(r.Context())
	if err != nil {
		log.Error.Println("Error getting user from context: ", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	el, err := db.GetEventsByOwner(user.ID)
	if err != nil {
		log.Error.Println("Error getting events by owner: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	eInfoList := rest.LatestEventsList(el, db)
	writeJson(w, http.StatusOK, eInfoList)
}

// CreateEvent godoc
//
//	@ID			CreateEvent
//	@Summary	Create a New Event
//	@Tags		Events
//	@Accept		json
//	@Produce	json
//	@Param		eventParams	body	rest.NewEventParams	true	"Event params"
//	@Success	201
//	@Failure	400	"Bad Request"
//	@Failure	401	"Unauthorized"
//	@Failure	500	"Internal Server Error"
//	@Router		/events [post]
func createEvent(w http.ResponseWriter, r *http.Request) {
	newEventParams, err := readCtxBody[rest.NewEventParams](w, r)
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

	newEventParams.OwnerID = user.ID

	newEvent := models.Event{
		Name:        newEventParams.Name,
		Location:    newEventParams.Location,
		Description: newEventParams.Description,
		DietaryInfo: newEventParams.DietaryInfo,
		StartTime:   time.UnixMilli(newEventParams.StartTime),
		EndTime:     time.UnixMilli(newEventParams.EndTime),
		Capacity:    newEventParams.Capacity,
		OwnerId:     newEventParams.OwnerID,
	}

	err = db.NewEvent(newEvent)
	if err != nil {
		log.Error.Println("Error creating event: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	go func() {
		err := mail.SendEventCreationEmail(newEvent, db)
		if err != nil {
			log.Error.Println("Error sending event creation email: ", err)
		}
	}()

	w.WriteHeader(http.StatusCreated)
}

// ModifyEvent godoc
//
//	@ID			ModifyEvent
//	@Summary	Modify an Existing Event
//	@Tags		Events
//	@Accept		json
//	@Produce	json
//	@Param		id		path	int					true	"Event ID"
//	@Param		event	body	rest.NewEventParams	true	"Updated event details"
//	@Success	200		"Event modified successfully"
//	@Failure	400		"Invalid Event ID or Bad request"
//	@Failure	401		"Unauthorized"
//	@Failure	403		"Forbidden - Not the event owner"
//	@Failure	500		"Internal Server Error"
//	@Router		/events/{eventId} [put]
func modifyEvent(w http.ResponseWriter, r *http.Request) {
	newEventParams, err := readCtxBody[rest.NewEventParams](w, r)
	if err != nil {
		return
	}

	eventIDStr := chi.URLParam(r, "eventId")
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

	// Check if the user owns the event
	event, err := db.GetEventById(eventID)
	if err != nil {
		log.Error.Println("Error getting event owner:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if user.ID != event.OwnerId {
		// The user does not own this event
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	newEvent := models.Event{
		Name:        newEventParams.Name,
		Location:    newEventParams.Location,
		Description: newEventParams.Description,
		DietaryInfo: newEventParams.DietaryInfo,
		StartTime:   time.UnixMilli(newEventParams.StartTime),
		EndTime:     time.UnixMilli(newEventParams.EndTime),
		Capacity:    newEventParams.Capacity,
		OwnerId:     user.ID,
	}

	err = db.ModifyEvent(eventID, newEvent)
	if err != nil {
		log.Error.Println("Error modifying event: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// ReserveEvent godoc
//
//	@ID			ReserveEvent
//	@Summary	Reserve a Spot in an Event
//	@Tags		Events
//	@Produce	json
//	@Param		id	path		int					true	"Event ID"
//	@Success	201	{object}	map[string]string	"Reservation created successfully"
//	@Failure	400	"Invalid Event ID"
//	@Failure	401	"Unauthorized"
//	@Failure	409	"You already have a reservation for this event"
//	@Failure	500	"Internal Server Error"
//	@Router		/events/{eventId}/reservations [post]
func reserveEvent(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "eventId")
	if eventIDStr == "" {
		log.Error.Println("No event ID")
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	eventID, err := strconv.Atoi(eventIDStr)
	if err != nil {
		log.Error.Println("Error converting event ID to int: ", err)
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

	event, err := db.GetEventById(eventID)
	if err != nil {
		log.Error.Println("Error getting event:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if time.Until(event.StartTime) < 10*time.Minute {
		err = mail.SendEventStartingSoonToUser(event, user)
		if err != nil {
			log.Error.Println("Error sending event starting soon email to user: ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
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

// GetEventReservations godoc
//
//	@ID			GetEventReservations
//	@Summary	Fetch the list of users who are reserved for an event
//	@Tags		Events
//	@Produce	json
//	@Param		id	path	int	true	"Event ID"
//	@Success	201	{array}	rest.UserInfo
//	@Failure	400	"Invalid Event ID"
//	@Failure	401	"Unauthorized"
//	@Failure	500	"Internal Server Error"
//	@Router		/events/{eventId}/reservations [get]
func getEventReservations(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "eventId")
	eventID, err := strconv.Atoi(eventIDStr)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	db := databaseFromContext(r.Context())

	// Check if reservation already exists
	users, err := db.GetReservationsByEventId(eventID)
	if err != nil {
		log.Error.Println("Error checking reservation:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var usersInfo []rest.UserInfo
	for _, u := range users {
		usersInfo = append(usersInfo, rest.NewUserInfo(u))
	}

	writeJson(w, http.StatusOK, usersInfo)
}

// RemoveReservationFromCode godoc
//
//	@ID			RemoveReservationFromCode
//	@Summary	Remove a Reservation by Code
//	@Tags		Events
//	@Produce	json
//	@Param		id		path		int					true	"Event ID"
//	@Param		code	query		string				true	"Reservation code"
//	@Success	200		{object}	map[string]string	"Reservation cleared successfully"
//	@Failure	400		"Invalid request or missing code"
//	@Failure	401		"Unauthorized"
//	@Failure	403		"Forbidden - Not the event owner"
//	@Failure	404		"Reservation not found"
//	@Failure	500		"Internal Server Error"
//	@Router		/events/{eventId}/reservations [patch]
func removeReservationFromCode(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "eventId")
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
	event, err := db.GetEventById(eventID)
	if err != nil {
		log.Error.Println("Error getting event owner:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if user.ID != event.OwnerId {
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
//	@ID			RemoveReservationFromUser
//	@Summary	Remove the Authenticated User's Reservation
//	@Tags		Events
//	@Produce	json
//	@Param		id	path		int					true	"Event ID"
//	@Success	200	{object}	map[string]string	"Reservation cleared successfully"
//	@Failure	400	"Invalid Event ID"
//	@Failure	401	"Unauthorized"
//	@Failure	500	"Internal Server Error"
//	@Router		/events/{eventId}/reservations [delete]
func removeReservationFromUser(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "eventId")
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
		"message": "Reservation cleared successfully",
		"eventID": eventIDStr,
		"userID":  strconv.Itoa(user.ID),
	})
}
