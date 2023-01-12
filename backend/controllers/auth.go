package controllers

import (
	"react-go-jwt/database"
	"react-go-jwt/models"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *fiber.Ctx) error {
	var data map[string]string

	response := make(map[string]string)

	err := c.BodyParser(&data)

	if err != nil {

		response["error"] = "Cant parse body"
		c.Status(400)
		
		return c.JSON(response)
	}

	pwd, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	user := models.User{
		Name: data["name"],
		Email: data["email"],
		Password: pwd,
	}

	res := database.DB.Create(&user)

	if res.Error != nil {

		response["error"] = "Such user exist"

		c.Status(400)

		return c.JSON(response)
	}
	
	return c.JSON(user)
}


func Login (c *fiber.Ctx) error {
	var data map[string]string

	response := make(map[string]string)


	err := c.BodyParser(&data)

	if err != nil {
		response["error"] = "cant parse body"
		c.Status(400)

		return c.JSON(response)
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.Id == 0 {
		response["error"] = "user not found"
		c.Status(400)

		return c.JSON(response)
	}

	err = bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"]))

	if err != nil {
		response["error"] = "invalid credentials"
		c.Status(400)
		
		return c.JSON(response)

	}

	return c.JSON(user)
}