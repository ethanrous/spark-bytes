package routes

import (
	"log"
	"net/http"

	"github.com/ethanrous/spark-bytes/models/rest"
)

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
		log.Println("Error creating user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// GetEvents godoc
//
// @ID			GetEvents
//
// @Summary		Get All Events
// @Tags		Events
// @Produce		json
// @Success		200
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
