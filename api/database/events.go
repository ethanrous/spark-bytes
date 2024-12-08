package database

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/ethanrous/spark-bytes/models"
	"github.com/ethanrous/spark-bytes/models/rest"
)

const eventTable = `
CREATE TABLE IF NOT EXISTS events (
	id SERIAL UNIQUE,
	name TEXT NOT NULL,
	location TEXT NOT NULL,
	description TEXT NOT NULL,
	dietary_info TEXT NOT NULL,
	owner_id INT NOT NULL,
	attendees INT NOT NULL,
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP NOT NULL
);
`

func (db Database) NewEvent(newEvent rest.NewEventParams) error {
	_, err := db.Exec(
		`INSERT INTO events (
			name,
			location,
			description,
			dietary_info,
			start_time,
			end_time,
			owner_id,
			attendees
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		newEvent.Name,
		newEvent.Location,
		newEvent.Description,
		newEvent.DietaryInfo,
		time.UnixMilli(newEvent.StartTime),
		time.UnixMilli(newEvent.EndTime),
		newEvent.OwnerID,
		newEvent.Attendees,
	)
	if err != nil {
		return err
	}

	return nil
}

func (db Database) reserveCodeExists(eventID int, code string) (bool, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM reservations WHERE event_id = $1 AND reserve_code = $2", eventID, code).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (db Database) GenerateReserveCode(eventID int) (string, error) {
	maxAttempts := 10
	for i := 0; i < maxAttempts; i++ {
		code := fmt.Sprintf("%04d", rand.Intn(10000))
		exists, err := db.reserveCodeExists(eventID, code)
		if err != nil {
			return "", err
		}
		if !exists {
			return code, nil
		}
	}
	return "", fmt.Errorf("could not generate a unique reservation code after %d attempts", maxAttempts)
}

func (db Database) CreateReservation(userID int, eventID int, reserveCode string) error {
	_, err := db.Exec("INSERT INTO reservations (user_id, event_id, reserve_code) VALUES ($1, $2, $3)", userID, eventID, reserveCode)
	return err
}

func (db Database) DeleteReservationFromCode(ownerID int, eventID int, reserveCode string) error {
	var count int
	db.QueryRow("SELECT COUNT(*) FROM events WHERE owner_id = $1 AND id = $2", ownerID, eventID).Scan(&count)

	if count != 1 {
		return fmt.Errorf("owner %d does not own event %d", ownerID, eventID)
	}

	_, err := db.Exec("DELETE FROM reservation WHERE event_id = $1, AND reserve_code = $2", eventID, reserveCode)
	return err
}

func (db Database) GetLatestEvents() ([]models.Event, error) {
	sqlQuery := `
        SELECT
            events.id,
            events.name,
            events.location,
            events.description,
            events.dietary_info,
            events.owner_id,
            events.start_time,
            events.end_time,
            events.attendees,
            users.email,
            users.first_name,
            users.last_name,
            users.joined_at
        FROM events
        INNER JOIN users ON users.id = events.owner_id
    `
	rows, err := db.Queryx(sqlQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.Event

	for rows.Next() {
		event := models.Event{}
		err = rows.StructScan(&event)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}
	return events, nil
}
