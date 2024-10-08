package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Define a struct for the Name object
type Name struct {
	First string `bson:"first"`
	Last  string `bson:"last"`
}

// Define the User struct with the desired structure
type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	Name         Name               `bson:"name"`
	Email        string             `bson:"email"`
	Password     string             `bson:"password"`
	RefreshToken string             `bson:"refresh_token,omitempty"`
	Username     string             `bson:"username"`
	Roles        []string           `bson:"roles"`
}

type Profile struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Name     Name               `bson:"name"`
	Email    string             `bson:"email"`
	Username string             `bson:"username"`
	Roles    []string           `bson:"roles"`
}
