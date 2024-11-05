package database

import (
	"fmt"
	"log"

	"github.com/ethanrous/spark-bytes/models"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var db *sqlx.DB

func InitDB() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", "localhost", 5432, "p_user", "p_password", "product_db")

	postgresDB, err := sqlx.Connect("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}

	pingErr := postgresDB.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
	log.Println("DB Connected!")
	db = postgresDB
}

func SearchByKeyword(keyword string) ([]models.Product, error) {
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
