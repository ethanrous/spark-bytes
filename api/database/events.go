package database

import (
	// "errors"
	// "time"

	"github.com/ethanrous/spark-bytes/models"
	"github.com/ethanrous/spark-bytes/models/rest"
)

func (db Database) NewEvent(newEvent rest.NewEventParams) error {
	_, err := db.Exec(
		"INSERT INTO events (name, location, description, dietary_info, start_time, end_time, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		newEvent.Name,
		newEvent.Location,
		newEvent.Description,
		newEvent.DietaryInfo,
		newEvent.StartTime,
		newEvent.EndTime,
		newEvent.OwnerID,
	)
	if err != nil {
		return err
	}

	return nil
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
