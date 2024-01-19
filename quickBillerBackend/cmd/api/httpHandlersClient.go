package main

import (
	"net/http"
	"net/url"
	"quickBiller/internal/models"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (app *application) GetCompanyDataListByUserID(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "user_id")
	clientList, err := app.Repository.GetClientsByUserID(userID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	response := JSONResponse{
		Data: clientList,
	}

	_ = app.writeJSON(w, http.StatusOK, response)
}

func (app *application) InsertClient(w http.ResponseWriter, r *http.Request) {
	var clientData *models.Client

	err := app.readJSON(w, r, &clientData)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	clientID, err := app.Repository.InsertClient(clientData)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	response := JSONResponse{
		Data:    clientID,
		Message: "client successfully added to the list",
	}

	_ = app.writeJSON(w, http.StatusCreated, response)
}

func (app *application) GetClientByID(w http.ResponseWriter, r *http.Request) {
	clientIDParam := chi.URLParam(r, "client_id")
	clientID, err := strconv.Atoi(clientIDParam)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	client, err := app.Repository.GetClientByID(clientID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	response := JSONResponse{
		Data: client,
	}

	_ = app.writeJSON(w, http.StatusOK, response)
}

func (app *application) GetClientByName(w http.ResponseWriter, r *http.Request) {
	// Retrieve the client_name parameter from the URL
	companyName := chi.URLParam(r, "client_name")

	// Decode URL-encoded characters (e.g., %20 to space)
	decodedCompanyName, err := url.QueryUnescape(companyName)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	company, err := app.Repository.GetClientByName(decodedCompanyName)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	response := JSONResponse{Data: company}
	_ = app.writeJSON(w, http.StatusOK, response)
}
