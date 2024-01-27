package main

import (
	"errors"
	"net/http"
	"quickBiller/internal/controllers"
	"quickBiller/internal/models"

	"gorm.io/gorm"
)

func (app *application) ProcessQuoteCreation(w http.ResponseWriter, r *http.Request) {

	type QuoteName struct {
		Filename    string `json:"filename"`
		QuoteNumber string `json:"quote_no"`
		QuoteID     int    `json:"quote_id"`
	}

	// get the latest invoice by userID which is in the payload
	var payload *models.Quote
	if err := app.readJSON(w, r, &payload); err != nil {
		app.errorJSON(w, err)
		return
	}

	userID := payload.UserID
	latestQuoteName, err := app.Repository.GetLatestQuoteName(userID)
	if err != nil {
		app.errorJSON(w, err)
		if errors.Is(err, gorm.ErrRecordNotFound) {
			latestQuoteName = ""
		}
	}

	// generate a new name
	newQuoteName, err := controllers.GenerateNewDocName(latestQuoteName, payload.ClientName)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// create a new invoice in db
	newQuote := *&models.Quote{
		Filename:       newQuoteName,
		ClientName:     payload.ClientName,
		QuoteNumber:    newQuoteName[3:11],
		UserID:         payload.UserID,
		TotalInclusive: payload.TotalInclusive,
		TotalExclusive: payload.TotalExclusive,
		VAT:            payload.VAT,
		Costs:          payload.Costs,
	}

	QuoteID, err := app.Repository.InserQuote(&newQuote)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// return the name to the client
	quoteResponse := QuoteName{
		Filename:    newQuote.Filename,
		QuoteNumber: newQuote.QuoteNumber,
		QuoteID:     QuoteID,
	}

	response := JSONResponse{
		Data:    quoteResponse,
		Message: "a new quote was created",
	}
	_ = app.writeJSON(w, http.StatusCreated, response)

}
