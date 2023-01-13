package database

import (
	"fmt"
	"react-go-jwt/enviroment"
	"react-go-jwt/models"

	"github.com/caarlos0/env/v6"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	cfg := enviroment.GetConfig()

	err := env.Parse(cfg)

	if (err != nil) {
		panic("cound not parse env config")
	}

	dsl := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", cfg.DbUser, cfg.DbPassword, cfg.DbHost, cfg.DbPort, cfg.DbName)

	connection, err := gorm.Open(mysql.Open(dsl), &gorm.Config{})

	if err != nil {
		panic("cant connect to the db")
	}

	DB = connection

	connection.AutoMigrate(&models.User{})
}