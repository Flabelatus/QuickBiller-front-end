package models

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UserName string     `json:"username"`
	Email    string     `json:"email"`
	Password string     `json:"password"`
	Mode     Mode       `gorm:"foreignKey:UserID" json:"mode"`
	Invoices []*Invoice `gorm:"foreignKey:UserID" json:"invoices"`
	Quotes   []*Quote   `gorm:"foreignKey:UserID" json:"quotes"`
	Sender   Sender     `gorm:"foreignKey:UserID" json:"sender"`
}

type Mode struct {
	gorm.Model
	Name   string `json:"mode_name"`
	UserID int    `json:"user_id"`
}

func (u *User) PasswordMatches(plainText string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(plainText))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			// invalid password
			return false, nil
		default:
			return false, err
		}
	}
	return true, nil
}
