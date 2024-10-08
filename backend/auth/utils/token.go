package utils

import (
	"errors"
	"time"

	"auth/config"

	"github.com/dgrijalva/jwt-go"
)

func GenerateJWT(userID string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  userID,
		"exp": time.Now().Add(time.Hour * 1).Unix(), // Access token valid for 1 hour
	})

	return token.SignedString([]byte(config.GetJWTSecret()))
}

func GenerateRefreshToken(userID string) (string, error) {
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  userID,
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(), // Refresh token valid for 7 days
	})

	return refreshToken.SignedString([]byte(config.GetJWTSecret()))
}

func ParseToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(config.GetJWTSecret()), nil
	})

	return token, err
}
