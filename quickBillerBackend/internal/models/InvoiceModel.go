package models

import (
	"gorm.io/gorm"
)

type Invoice struct {
	gorm.Model
	Filename       string  `json:"filename"`
	InvoiceNumber  string  `json:"invoice_no"`
	TotalInclusive float32 `json:"total_inclusive"`
	VAT            int     `json:"vat_percent"`
	TotalExclusive float32 `json:"total_exclusive"`
	Costs          float32 `json:"costs"`
	UserID         string  `json:"user_id"`
	ClientName     string  `json:"client_name"`
}
