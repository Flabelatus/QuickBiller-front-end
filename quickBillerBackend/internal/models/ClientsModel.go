package models

import "gorm.io/gorm"

type ClientInvoice struct {
	gorm.Model
	CompanyName string `json:"company_name"`
	ContactName string `json:"contact_name"`
	Email       string `json:"email"`
	Street      string `json:"street"`
	Postcode    string `json:"postcode"`
	City        string `json:"city"`
	Country     string `json:"country"`
	InvoiceID   int    `json:"invoice_id"`
}

type ClientQuote struct {
	gorm.Model
	CompanyName string `json:"company_name"`
	ContactName string `json:"contact_name"`
	Email       string `json:"email"`
	Street      string `json:"street"`
	Postcode    string `json:"postcode"`
	City        string `json:"city"`
	Country     string `json:"country"`
	QuoteID     int    `json:"quote_id"`
}
