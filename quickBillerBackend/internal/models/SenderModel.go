package models

import "gorm.io/gorm"

type Sender struct {
	gorm.Model
	CompanyName string `json:"company_name"`
	ContactName string `json:"contact_name"`
	Email       string `json:"email"`
	Street      string `json:"street"`
	Postcode    string `json:"postcode"`
	City        string `json:"city"`
	Country     string `json:"country"`
	Iban        string `json:"iban"`
	VatNo       string `json:"vat_no"`
	CocNo       string `json:"coc_no"`
	UserId      int    `json:"user_id"`
}
