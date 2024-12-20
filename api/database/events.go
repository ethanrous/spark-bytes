package database

import (
	"fmt"
	"math/rand"

	"github.com/ethanrous/spark-bytes/models"
)

const eventTable = `
CREATE TABLE IF NOT EXISTS events (
	id SERIAL UNIQUE,
	name TEXT NOT NULL,
	location TEXT NOT NULL,
	description TEXT NOT NULL,
	dietary_info TEXT NOT NULL,
	owner_id INT NOT NULL,
	capacity INT NOT NULL,
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP NOT NULL,
	is_closed BOOLEAN NOT NULL DEFAULT FALSE
);
`

const reservationsTable = `
CREATE TABLE IF NOT EXISTS reservations (
	id SERIAL UNIQUE,
	user_id INT NOT NULL,
	event_id INT NOT NULL,
	reserve_code TEXT NOT NULL
);
`

func (db Database) NewEvent(newEvent models.Event) error {
	_, err := db.Exec(
		`INSERT INTO events (
			name,
			location,
			description,
			dietary_info,
			start_time,
			end_time,
			owner_id,
			capacity
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		newEvent.Name,
		newEvent.Location,
		newEvent.Description,
		newEvent.DietaryInfo,
		newEvent.StartTime,
		newEvent.EndTime,
		newEvent.OwnerId,
		newEvent.Capacity,
	)
	if err != nil {
		return err
	}

	return nil
}

func (db Database) ModifyEvent(eventID int, newEvent models.Event) error {
	_, err := db.Exec(
		`UPDATE events
		 SET
			name = $1,
			location = $2,
			description = $3,
			dietary_info = $4,
			start_time = $5,
			end_time = $6,
			owner_id = $7,
			capacity = $8
		WHERE id = $9`,
		newEvent.Name,
		newEvent.Location,
		newEvent.Description,
		newEvent.DietaryInfo,
		newEvent.StartTime,
		newEvent.EndTime,
		newEvent.OwnerId,
		newEvent.Capacity,
		eventID,
	)
	if err != nil {
		return err
	}

	return nil
}

func (db Database) CloseEvent(eventID int) error {
	_, err := db.Exec(
		`UPDATE events
		 SET
			is_closed = true
		WHERE id = $1`,
		eventID,
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

func (db Database) GetEventById(eventID int) (models.Event, error) {
	var event models.Event
	err := db.Get(&event, "SELECT * FROM events WHERE id = $1", eventID)
	return event, err
}

func (db Database) DeleteReservationFromCode(eventID int, reserveCode string) (int64, error) {
	res, err := db.Exec("DELETE FROM reservations WHERE event_id = $1, AND reserve_code = $2", eventID, reserveCode)
	if err != nil {
		return 0, err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return 0, err
	}
	return rowsAffected, nil
}

func (db Database) DeleteReservationFromUser(eventID int, userID int) error {
	_, err := db.Exec("DELETE FROM reservations WHERE event_id = $1 AND user_id = $2", eventID, userID)
	if err != nil {
		return err
	}
	return nil
}

func (db Database) GetLatestEvents() ([]models.Event, error) {
	sqlQuery := `SELECT * FROM events`
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

func (db Database) GetEventsByOwner(ownerID int) ([]models.Event, error) {
	sqlQuery := `
        SELECT
            *
        FROM events
		WHERE owner_id = $1
    `
	rows, err := db.Queryx(sqlQuery, ownerID)
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

func (db Database) ReservationExists(userID, eventID int) (bool, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM reservations WHERE user_id = $1 AND event_id = $2", userID, eventID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (db Database) GetReservationsByEventId(eventID int) ([]models.User, error) {
	sqlQuery := `
		SELECT
			users.id,
            users.email,
            users.first_name,
            users.last_name,
            users.joined_at
        FROM users
        INNER JOIN reservations ON users.id = reservations.user_id
		WHERE reservations.event_id = $1
	`
	rows, err := db.Queryx(sqlQuery, eventID)
	if err != nil {
		return nil, err
	}

	var users []models.User
	for rows.Next() {
		user := models.User{}
		err = rows.StructScan(&user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}
