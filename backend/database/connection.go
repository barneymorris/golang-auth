package database

import (
	"react-go-jwt/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	connection, err := gorm.Open(mysql.Open("go:pass@tcp(db:3306)/db" ), &gorm.Config{})

	if err != nil {
		panic("cant connect to the db")
	}

	DB = connection

	connection.AutoMigrate(&models.User{})
}