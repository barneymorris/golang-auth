package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Connect() {
	_, err := gorm.Open(mysql.Open("root:pass@/db"), &gorm.Config{})

	if err != nil {
		panic("cant connect to the db")
	}
}