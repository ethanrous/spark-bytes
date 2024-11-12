package main

import (
	"fmt"
	"log"

	"github.com/ethanrous/spark-bytes/database"
	"github.com/ethanrous/spark-bytes/routes"
)

func main() {
	db, err := database.InitDB()
	if err != nil {
		log.Fatalln("Error initializing database: ", err)
	}

	srv := routes.NewServer(db)
	err = srv.Start(5001)
	if err != nil {
		fmt.Println("ROUTER ERROR ", err)
	}
}
