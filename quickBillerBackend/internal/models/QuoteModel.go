package models

import (
	"time"

	"gorm.io/gorm"
)

type Quote struct {
	gorm.Model
	Logo        string    `json:"logo"`
	Message     string    `json:"message"`
	ValidDate   time.Time `json:"valid_date"`
	QuoteDate   time.Time `json:"quote_date"`
	QuoteNumber string    `json:"quote_no"`
	JobData     string    `json:"job_data"`
	ClientData  Client    `gorm:"foreignKey:InvoiceID" json:"client_data"`
	SenderData  Sender    `gorm:"foreignKey:InvoiceID" json:"sender_data"`
	UserID      int       `json:"user_id"`
}
