package models

import (
	"time"

	"gorm.io/gorm"
)

type Invoice struct {
	gorm.Model
	Filename      string    `json:"filename"`
	DueTerm       time.Time `json:"due_term"`
	InvoiceDate   time.Time `json:"invoice_date"`
	InvoiceNumber string    `json:"invoice_no"`
	JobData       string    `json:"job_data"`
	UserID        string    `json:"user_id"`
	ClientID      int       `json:"client_id"`
}
