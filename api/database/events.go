package database

import (
	// "errors"
	// "time"

	"github.com/ethanrous/spark-bytes/models"
)


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
