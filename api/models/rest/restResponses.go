package rest

import (
	"time"

	"github.com/ethanrous/spark-bytes/models"
)

type UserInfo struct {
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Verified  bool      `json:"verified"`
	JoinedAt  time.Time `json:"joined_at"`
} // @name UserInfo

type OwnerInfo struct {
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	JoinedAt  time.Time `json:"joined_at"`
} // @name OwnerInfo

type EventInfo struct {
	Name        string    `json:"name"`
	Location    string    `json:"location"`
	Description string    `json:"description"`
	DietaryInfo string    `json:"dietary_info"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
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
			Name:        e.Name,
			Location:    e.Location,
			Description: e.Description,
			DietaryInfo: e.DietaryInfo,
			StartTime:   e.StartTime,
			EndTime:     e.EndTime,
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
