package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
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
