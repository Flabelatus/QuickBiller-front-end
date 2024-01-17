package main

import (
	"fmt"
	"net/http"
	"quickBiller/internal/models"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

func (app *application) GetAllUserModes(w http.ResponseWriter, r *http.Request) {
	errChan := make(chan error)
	modeChan := make(chan []models.Mode)

	go func() {
		modes, err := app.Repository.GetAllModes()
		if err != nil {
			errChan <- err
		} else {
			modeChan <- modes
		}
	}()

	select {
	case modes := <-modeChan:
		_ = app.writeJSON(w, http.StatusOK, modes)
	case err := <-errChan:
		app.errorJSON(w, err)
	}
}

func (app *application) GetUsersModeByUserID(w http.ResponseWriter, r *http.Request) {
	IDParam := chi.URLParam(r, "user_id")

	errChan := make(chan error)
	userChan := make(chan *models.User)

	go func() {
		user, err := app.Repository.GetUserByID(IDParam)
		if err != nil {
			errChan <- err
		} else {
			userChan <- user
		}
	}()

	select {
	case user := <-userChan:
		mode := user.Mode.Name
		_ = app.writeJSON(w, http.StatusOK, mode)
	case err := <-errChan:
		app.errorJSON(w, fmt.Errorf("error getting the user mode - %v", err))
	}
}

func (app *application) GetUserModeByID(w http.ResponseWriter, r *http.Request) {
	IDParams := chi.URLParam(r, "mode_id")
	modeID, err := strconv.Atoi(IDParams)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	errChan := make(chan error)
	modeChan := make(chan *models.Mode)

	go func() {
		mode, err := app.Repository.GetModeByID(modeID)
		if err != nil {
			errChan <- err
		} else {
			modeChan <- mode
		}
	}()

	select {
	case mode := <-modeChan:
		_ = app.writeJSON(w, http.StatusOK, mode)
	case err := <-errChan:
		app.errorJSON(w, err)
	}
}

func (app *application) CreateUserMode(w http.ResponseWriter, r *http.Request) {
	var mode *models.Mode
	// read response
	err := app.readJSON(w, r, &mode)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	modeChanel := make(chan *models.Mode)
	errChanel := make(chan error)

	mode.CreatedAt = time.Now()
	mode.UpdatedAt = time.Now()

	go func() {
		err := app.Repository.CreateMode(mode)
		if err != nil {
			errChanel <- err
		} else {
			modeChanel <- mode
		}
	}()

	select {
	case mode := <-modeChanel:
		response := JSONResponse{
			Message: "mode created",
			Data:    mode,
		}
		_ = app.writeJSON(w, http.StatusAccepted, response)
	case err := <-errChanel:
		app.errorJSON(w, err)
	}
}

func (app *application) UpdateUserMode(w http.ResponseWriter, r *http.Request) {
	IDParam := chi.URLParam(r, "mode_id")
	modeID, err := strconv.Atoi(IDParam)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	var payload *models.Mode
	err = app.readJSON(w, r, &payload)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	errChan := make(chan error)
	modeChan := make(chan *models.Mode)

	go func() {
		mode, err := app.Repository.GetModeByID(int(modeID))
		if err != nil {
			errChan <- err
		}
		mode.Name = payload.Name
		mode.UpdatedAt = time.Now()

		err = app.Repository.UpdateMode(modeID, mode)
		if err != nil {
			errChan <- err
		} else {
			modeChan <- mode
		}
	}()

	select {
	case mode := <-modeChan:
		response := JSONResponse{
			Message: "mode successfully updated",
			Data:    mode,
		}
		_ = app.writeJSON(w, http.StatusOK, response)
	case err := <-errChan:
		app.errorJSON(w, err)

	}
}

func (app *application) DeleteUserMode(w http.ResponseWriter, r *http.Request) {
	IDParam := chi.URLParam(r, "mode_id")
	modeID, err := strconv.Atoi(IDParam)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	errChan := make(chan error)

	go func() {
		err := app.Repository.DeleteModeByID(modeID)
		if err != nil {
			errChan <- err
		} else {
			errChan <- nil
		}
	}()

	err = <-errChan
	if err != nil {
		app.errorJSON(w, err)
	}
	response := JSONResponse{
		Error:   false,
		Message: "successfully removed user mode",
	}
	_ = app.writeJSON(w, http.StatusOK, response)
}

//  User handlers

func (app *application) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	errChan := make(chan error)
	uChan := make(chan []models.User)

	go func() {
		users, err := app.Repository.GetAllUsers()
		if err != nil {
			errChan <- err
		} else {
			uChan <- users
		}
	}()

	select {
	case users := <-uChan:
		_ = app.writeJSON(w, http.StatusOK, users)
	case err := <-errChan:
		app.errorJSON(w, err)
	}
}

// Get User By ID is in authHandlers.go
// Create User is in authHandlers.go as register

func (app *application) UpdateUser(w http.ResponseWriter, r *http.Request) {
	IDParam := chi.URLParam(r, "user_id")

	var payload *models.User
	err := app.readJSON(w, r, &payload)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	errChan := make(chan error)
	uChan := make(chan *models.User)

	go func() {
		u, err := app.Repository.GetUserByID(IDParam)
		if err != nil {
			errChan <- err
		}

		u.UserName = payload.UserName
		u.Email = payload.Email

		err = app.Repository.UpdateUser(IDParam, u)
		if err != nil {
			errChan <- err
		} else {
			uChan <- u
		}
	}()

	select {
	case u := <-uChan:
		response := JSONResponse{
			Message: "user successfully updated",
			Data:    u,
		}
		_ = app.writeJSON(w, http.StatusOK, response)
	case err := <-errChan:
		app.errorJSON(w, err)

	}
}

func (app *application) DeleteUser(w http.ResponseWriter, r *http.Request) {
	IDParam := chi.URLParam(r, "user_id")

	errChan := make(chan error)

	go func() {
		err := app.Repository.DeleteUserByID(IDParam)
		if err != nil {
			errChan <- err
		} else {
			errChan <- nil
		}
	}()

	err := <-errChan
	if err != nil {
		app.errorJSON(w, err)
	}
	response := JSONResponse{
		Error:   false,
		Message: "successfully removed user",
	}
	_ = app.writeJSON(w, http.StatusOK, response)
}
