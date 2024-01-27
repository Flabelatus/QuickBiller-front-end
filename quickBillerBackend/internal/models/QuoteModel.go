package models

import (
	"gorm.io/gorm"
)

type Quote struct {
	gorm.Model
	Filename       string  `json:"filename"`
	QuoteNumber    string  `json:"quote_no"`
	TotalInclusive float32 `json:"total_inclusive"`
	Costs          float32 `json:"costs"`
	TotalExclusive float32 `json:"total_exclusive"`
	VAT            int     `json:"vat_percent"`
	UserID         string  `json:"user_id"`
	ClientName     string  `json:"client_name"`
}
