package services

import (
	"context"
	"errors"
	"time"

	"auth/models"
	"auth/utils"

	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserCollection *mongo.Collection
}

func NewAuthService(userCollection *mongo.Collection) *AuthService {
	return &AuthService{UserCollection: userCollection}
}

func (s *AuthService) Register(user models.User) (string, string, error) {
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", "", err
	}
	user.Password = string(passwordHash)
	user.ID = primitive.NewObjectID()

	token, err := utils.GenerateJWT(user.ID.Hex())
	if err != nil {
		return "", "", err
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID.Hex())
	if err != nil {
		return "", "", err
	}

	user.RefreshToken = refreshToken

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = s.UserCollection.InsertOne(ctx, user)
	if err != nil {
		return "", "", err
	}

	return token, refreshToken, nil
}

func (s *AuthService) Login(email, password string) (string, string, error) {
	var user models.User

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := s.UserCollection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return "", "", errors.New("invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", "", errors.New("invalid email or password")
	}

	token, err := utils.GenerateJWT(user.ID.Hex())
	if err != nil {
		return "", "", err
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID.Hex())
	if err != nil {
		return "", "", err
	}

	_, err = s.UserCollection.UpdateOne(ctx, bson.M{"_id": user.ID}, bson.M{"$set": bson.M{"refresh_token": refreshToken}})
	if err != nil {
		return "", "", err
	}

	return token, refreshToken, nil
}

func (s *AuthService) RefreshToken(refreshToken string) (string, string, error) {
	token, err := utils.ParseToken(refreshToken)
	if err != nil {
		return "", "", errors.New("invalid refresh token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", "", errors.New("invalid refresh token")
	}

	userID := claims["id"].(string)

	var user models.User
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = s.UserCollection.FindOne(ctx, bson.M{"_id": userID, "refresh_token": refreshToken}).Decode(&user)
	if err != nil {
		return "", "", errors.New("invalid refresh token")
	}

	newToken, err := utils.GenerateJWT(user.ID.Hex())
	if err != nil {
		return "", "", err
	}

	newRefreshToken, err := utils.GenerateRefreshToken(user.ID.Hex())
	if err != nil {
		return "", "", err
	}

	_, err = s.UserCollection.UpdateOne(ctx, bson.M{"_id": user.ID}, bson.M{"$set": bson.M{"refresh_token": newRefreshToken}})
	if err != nil {
		return "", "", err
	}

	return newToken, newRefreshToken, nil
}
