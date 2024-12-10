package rest

import (
	"time"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/ethanrous/spark-bytes/internal/log"
	"github.com/ethanrous/spark-bytes/models"
)

type UserInfo struct {
	ID        int       `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Email     string    `json:"email"`
	Verified  bool      `json:"verified"`
	JoinedAt  time.Time `json:"joinedAt"`
} // @name UserInfo

type OwnerInfo struct {
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Email     string    `json:"email"`
	JoinedAt  time.Time `json:"joinedAt"`
} // @name OwnerInfo

type EventInfo struct {
	EventId         int    `json:"eventId" validate:"required"`
	Name            string `json:"name" validate:"required"`
	Location        string `json:"location" validate:"required"`
	Description     string `json:"description" validate:"required"`
	DietaryInfo     string `json:"dietaryInfo" validate:"required"`
	StartTime       int64  `json:"startTime" validate:"required"`
	EndTime         int64  `json:"endTime" validate:"required"`
	Capacity        int    `json:"capacity" validate:"required"`
	OwnerId         int    `json:"owner" validate:"required"`
	RegisteredCount int    `json:"registeredCount" validate:"required"`
	Reservations    []int  `json:"reservationIds" validate:"required"`
} // @name EventInfo

func NewUserInfo(u models.User) UserInfo {
	return UserInfo{
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		Verified:  u.IsVerified,
		JoinedAt:  u.JoinedAt,
	}
}

func NewEventInfo(e models.Event, db database.Database) EventInfo {
	newInfo := EventInfo{
		EventId:     e.ID,
		Name:        e.Name,
		Location:    e.Location,
		Description: e.Description,
		DietaryInfo: e.DietaryInfo,
		StartTime:   e.StartTime.UnixMilli(),
		EndTime:     e.EndTime.UnixMilli(),
		Capacity:    e.Capacity,
		OwnerId:     e.OwnerId,
	}

	users, err := db.GetReservationsByEventId(e.ID)
	if err != nil {
		log.Error.Println(err)
		return newInfo
	}

	newInfo.RegisteredCount = len(users)
	for _, u := range users {
		newInfo.Reservations = append(newInfo.Reservations, u.ID)
	}

	return newInfo
}

func LatestEventsList(el []models.Event, db database.Database) []EventInfo {
	if len(el) == 0 {
		return []EventInfo{}
	}
	var eventList []EventInfo

	for _, e := range el {
		eventList = append(eventList, NewEventInfo(e, db))
	}

	return eventList
}
