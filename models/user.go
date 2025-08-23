package models

type User struct {
	ID       int     `json:"id"`
	Name     string  `json:"Name"`
	Email    string  `json:"Email"`
	Password string  `json:"Password"`
	Favorites []Movie 
	Watchlist []Movie 
}