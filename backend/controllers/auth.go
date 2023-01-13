package controllers

import (
	"fmt"
	"react-go-jwt/database"
	"react-go-jwt/models"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const SECRET_KEY = "8kjasdlzx48vcx9qkzxc"

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

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer: strconv.Itoa(int(user.Id)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(SECRET_KEY))

	if err != nil {
		fmt.Printf("cant login: %s\n", err)

		response["error"] = "cant login"
		c.Status(400)
		
		return c.JSON(response)
	}

	cookie := fiber.Cookie{
		Name: "jwt",
		Value: token,
		Expires: time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func User(c *fiber.Ctx) error {
	response := make(map[string]string)

	cookie := c.Cookies("jwt")


	if cookie == "" {
		response["error"] = "not provided jwt cookie"
		c.Status(401)

		return c.JSON(response)
	}

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func (token *jwt.Token) (interface{}, error) {
		return []byte(SECRET_KEY), nil
	})

	if err != nil {
			response["error"] = "invalid credentials"
			c.Status(401)
	
			return c.JSON(response)
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	database.DB.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name: "jwt",
		Value: "",
		Expires: time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}