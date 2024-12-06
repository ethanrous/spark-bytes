package database

import (
	"fmt"

	"github.com/ethanrous/spark-bytes/internal/log"
	"github.com/ethanrous/spark-bytes/models"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func InitDB() (Database, error) {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", "localhost", 5432, "p_user", "p_password", "sparkbytes_db")

	postgresDB, err := sqlx.Connect("postgres", psqlInfo)
	if err != nil {
		return Database{}, err
	}

	err = postgresDB.Ping()
	if err != nil {
		return Database{}, err
	}
	log.Info.Println("DB Connected!")

	_, err = postgresDB.Exec(usersTable)
	if err != nil {
		log.Error.Println("Error creating users table: ", err)
		return Database{}, err
	}

	_, err = postgresDB.Exec(eventTable)
	if err != nil {
		log.Error.Println("Error creating events table: ", err)
		return Database{}, err
	}

	return Database{postgresDB}, nil
}

type Database struct {
	*sqlx.DB
}

func (db Database) SearchByKeyword(keyword string) ([]models.Product, error) {
	keyword = "%" + keyword + "%"
	rows, err := db.Queryx("SELECT * FROM products WHERE LOWER(name) LIKE $1 OR LOWER(description) LIKE $1", keyword)
	if err != nil {
		return nil, err
	}

	products := []models.Product{}
	for rows.Next() {
		target := models.Product{}
		err = rows.StructScan(&target)
		if err != nil {
			return nil, err
		}
		products = append(products, target)
	}

	return products, nil
}
