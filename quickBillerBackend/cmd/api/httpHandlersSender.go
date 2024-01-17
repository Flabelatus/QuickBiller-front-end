package main

import (
	"net/http"
	"quickBiller/internal/models"
)

func (app *application) GetCompanyDataListByUserID(w http.ResponseWriter, r *http.Request) {
	type RequestBody struct {
		UserID int `json:"user_id"`
	}

	req := RequestBody{}

	err := app.readJSON(w, r, &req)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	userID := req.UserID

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
