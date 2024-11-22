package models

import "time"

type EventOwner struct {
	ID         int       `db:"owner_id"`
    Email      string    `db:"email"`
    FirstName  string    `db:"first_name"`
    LastName   string    `db:"last_name"`
    JoinedAt   time.Time `db:"joined_at"`
}

type Event struct {
    ID          int       `db:"id"`
    Name        string    `db:"name"`
    Location    string    `db:"location"`
    Description string    `db:"description"`
    DietaryInfo string    `db:"dietary_info"`
    StartTime   time.Time `db:"start_time"`
    EndTime     time.Time `db:"end_time"`
    Attendees   int       `db:"attendees"`
    EventOwner
}
