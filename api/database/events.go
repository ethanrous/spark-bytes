package database

import (
	// "errors"

	"fmt"
	"math/rand"
	"time"

	"github.com/ethanrous/spark-bytes/models"
	"github.com/ethanrous/spark-bytes/models/rest"
)

func init() {
    rand.Seed(time.Now().UnixNano())
}


func (db Database) NewEvent(newEvent rest.NewEventParams) error {
	_, err := db.Exec("INSERT INTO events (name, location, description, dietary_info, start_time, end_time, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7)", newEvent.Name, newEvent.Location, newEvent.Description, newEvent.DietaryInfo, newEvent.StartTime, newEvent.EndTime, newEvent.OwnerID)
	if err != nil {
		return err
	}

	return nil
}

func (db Database) reserveCodeExists(code string) (bool, error) {
    var count int
    err := db.QueryRow("SELECT COUNT(*) FROM reservations WHERE reserve_code = $1", code).Scan(&count)
    if err != nil {
        return false, err
    }
    return count > 0, nil
}

func (db Database) GenerateReserveCode() (string, error) {
    maxAttempts := 10
    for i := 0; i < maxAttempts; i++ {
        code := fmt.Sprintf("%04d", rand.Intn(10000))
        exists, err := db.reserveCodeExists(code)
        if err != nil {
            return "", err
        }
        if !exists {
            return code, nil
        }
    }
    return "", fmt.Errorf("could not generate a unique reservation code after %d attempts", maxAttempts)
}

func (db Database) CreateReservation(userID, eventID int, reserveCode string) error {
    _, err := db.Exec("INSERT INTO reservations (user_id, event_id, reserve_code) VALUES ($1, $2, $3)", userID, eventID, reserveCode)
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
        ORDER BY end_time DESC
        LIMIT 10
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
