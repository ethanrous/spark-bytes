package main

import (
	"time"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/ethanrous/spark-bytes/internal/log"
	"github.com/ethanrous/spark-bytes/mail"
	"github.com/ethanrous/spark-bytes/routes"
)

func main() {
	db, err := database.InitDB()
	if err != nil {
		log.Error.Fatalln("Error initializing database: ", err)
	}

	go eventListener(db)

	srv := routes.NewServer(db)
	err = srv.Start(5001)
	if err != nil {
		log.Error.Println("ROUTER ERROR ", err)
	}
}

func eventListener(db database.Database) {
	for {
		time.Sleep(3 * time.Minute)
		events, err := db.GetLatestEvents()
		if err != nil {
			log.Error.Println("Event listener failed to get events: ", err)
			continue
		}

		for _, event := range events {
			if timeUntilStart := time.Until(event.StartTime); timeUntilStart < 10*time.Minute && timeUntilStart > 7*time.Minute {
				err = mail.SendEventStartingSoonEmail(event, db)
				if err != nil {
					log.Error.Println("Failed to send event starting soon email: ", err)
					continue
				}
				log.Info.Println("Event ", event.ID, " is starting soon!")
			}
		}
	}
}
