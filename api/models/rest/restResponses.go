package rest

import (
	"time"

	"github.com/ethanrous/spark-bytes/models"
)

type UserInfo struct {
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
	EventId     int       `json:"eventId"`
	Name        string    `json:"name"`
	Location    string    `json:"location"`
	Description string    `json:"description"`
	DietaryInfo string    `json:"dietaryInfo"`
	StartTime   int64     `json:"startTime"`
	EndTime     int64     `json:"endTime"`
	Attendees   int       `json:"attendees"`
	Owner       OwnerInfo `json:"owner"`
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

func LatestEventsList(el []models.Event) []EventInfo {
	eventList := make([]EventInfo, len(el))

	for i, e := range el {
		eventList[i] = EventInfo{
			EventId:     e.ID,
			Name:        e.Name,
			Location:    e.Location,
			Description: e.Description,
			DietaryInfo: e.DietaryInfo,
			StartTime:   e.StartTime.UnixMilli(),
			EndTime:     e.EndTime.UnixMilli(),
			Attendees:   e.Attendees,
			Owner: OwnerInfo{
				FirstName: e.EventOwner.FirstName,
				LastName:  e.EventOwner.LastName,
				Email:     e.EventOwner.Email,
				JoinedAt:  e.EventOwner.JoinedAt,
			},
		}
	}

	return eventList
}
