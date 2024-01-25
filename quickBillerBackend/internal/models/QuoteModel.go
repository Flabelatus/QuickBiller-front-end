package models

import (
	"time"

	"gorm.io/gorm"
)

type Quote struct {
	gorm.Model
	Filename    string    `json:"filename"`
	ValidDate   time.Time `json:"valid_date"`
	QuoteDate   time.Time `json:"quote_date"`
	QuoteNumber string    `json:"quote_no"`
	JobData     string    `json:"job_data"`
	UserID      string    `json:"user_id"`
	ClientID    int       `json:"client_id"`
}
