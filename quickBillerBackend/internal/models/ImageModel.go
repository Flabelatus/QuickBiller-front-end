package models

import "gorm.io/gorm"

type Image struct {
	gorm.Model
	Filename string `json:"filename"`
	FilePath string `json:"filepath"`
	UserID   string `json:"user_id"`
}
