package main

import (
	"errors"
	"net/http"
	"quickBiller/internal/controllers"
	"quickBiller/internal/models"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

func (app *application) GetInvoicesByUserID(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "user_id")
	invoices, err := app.Repository.GetInvoicesByUserID(userID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	response := JSONResponse{Data: invoices}
	_ = app.writeJSON(w, http.StatusOK, response)
}

func (app *application) GetLatestInvoiceName(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "user_id")
	latestInvoiceName, err := app.Repository.GetLatestInvoiceName(userID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	response := JSONResponse{Data: latestInvoiceName}
	_ = app.writeJSON(w, http.StatusOK, response)
}

func (app *application) InsertNewInvoice(w http.ResponseWriter, r *http.Request) {
	var payload *models.Invoice

	if err := app.readJSON(w, r, &payload); err != nil {
		app.errorJSON(w, err)
		return
	}

	invoiceID, err := app.Repository.InserInvoice(payload)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{Data: invoiceID, Message: "invoice successfully created"}
	_ = app.writeJSON(w, http.StatusCreated, resp)
}

func (app *application) ProcessInvoiceCreation(w http.ResponseWriter, r *http.Request) {

	type InvoiceName struct {
		Filename      string `json:"filename"`
		InvoiceNumber string `json:"invoice_no"`
		InvoiceID     int    `json:"invoice_id"`
	}

	// get the latest invoice by userID which is in the payload
	var payload *models.Invoice
	if err := app.readJSON(w, r, &payload); err != nil {
		app.errorJSON(w, err)
		return
	}

	userID := payload.UserID
	latestInvoiceName, err := app.Repository.GetLatestInvoiceName(userID)
	if err != nil {
		// app.errorJSON(w, err)
		if errors.Is(err, gorm.ErrRecordNotFound) {
			latestInvoiceName = ""
		}
	}

	// generate a new name
	newInvoiceName, err := controllers.GenerateNewDocName(latestInvoiceName, payload.ClientName)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// create a new invoice in db
	newInvoice := *&models.Invoice{
		Filename:       newInvoiceName,
		ClientName:     payload.ClientName,
		InvoiceNumber:  newInvoiceName[3:11],
		UserID:         payload.UserID,
		TotalInclusive: payload.TotalInclusive,
		TotalExclusive: payload.TotalExclusive,
		VAT:            payload.VAT,
		Costs:          payload.Costs,
	}

	invoiceID, err := app.Repository.InserInvoice(&newInvoice)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// return the name to the client
	invoiceResponse := InvoiceName{
		Filename:      newInvoice.Filename,
		InvoiceNumber: newInvoice.InvoiceNumber,
		InvoiceID:     invoiceID,
	}

	response := JSONResponse{
		Data:    invoiceResponse,
		Message: "a new invoice was created",
	}
	_ = app.writeJSON(w, http.StatusCreated, response)

}
