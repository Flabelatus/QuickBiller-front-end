package main

import (
	"errors"
	"fmt"
	"net/http"
	"quickBiller/internal/models"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

// Request/Response Handlers

func (a *application) Home(w http.ResponseWriter, r *http.Request) {
	// State that app is running
	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Platform is up and running!",
		Version: "1.0.0",
	}

	_ = a.writeJSON(w, http.StatusOK, payload)
}

// Authentication Handlers
func (app *application) authenticate(w http.ResponseWriter, r *http.Request) {
	var requestPayload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := app.readJSON(w, r, &requestPayload)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	user, err := app.Repository.GetUserByEmail(requestPayload.Email)
	if err != nil {
		app.errorJSON(w, errors.New("invalid credentials 1"), http.StatusBadRequest)
		return
	}

	valid, err := user.PasswordMatches(requestPayload.Password)
	if err != nil || !valid {
		app.errorJSON(w, errors.New("invalid email or password"), http.StatusUnauthorized)
		return
	}

	// create a jwt user
	u := jwtUser{
		ID:       user.ID,
		UserName: user.UserName,
	}

	// generate tokens
	tokens, err := app.auth.GenerateTokenPair(&u)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	refreshCookie := app.auth.GetRefreshCookie(tokens.RefreshToken)
	http.SetCookie(w, refreshCookie)

	app.writeJSON(w, http.StatusAccepted, tokens)
}

func (app *application) refreshToken(w http.ResponseWriter, r *http.Request) {
	for _, cookie := range r.Cookies() {
		if cookie.Name == app.auth.CookieName {
			claims := &Claims{}
			refreshToken := cookie.Value

			// parse the token to get the claims
			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(app.JWTSecret), nil
			})
			if err != nil {
				app.errorJSON(w, errors.New("unauthorized"), http.StatusUnauthorized)
				return
			}

			// get the User ID from the token claims
			userID := claims.Subject
			if err != nil {
				app.errorJSON(w, fmt.Errorf("unknown user - %v", err), http.StatusUnauthorized)
			}
			user, err := app.Repository.GetUserByID(userID)
			if err != nil {
				app.errorJSON(w, fmt.Errorf("unknown user - %v", err), http.StatusUnauthorized)
				return
			}

			u := jwtUser{
				ID:       user.ID,
				UserName: user.UserName,
			}

			tokenPairs, err := app.auth.GenerateTokenPair(&u)
			if err != nil {
				app.errorJSON(w, errors.New("error generating tokens"), http.StatusUnauthorized)
				return
			}

			http.SetCookie(w, app.auth.GetRefreshCookie(tokenPairs.RefreshToken))

			app.writeJSON(w, http.StatusOK, tokenPairs)
		}
	}
}

func (app *application) logout(w http.ResponseWriter, r *http.Request) {

	http.SetCookie(w, app.auth.GetExpiredRefreshCookie())
	w.WriteHeader(http.StatusAccepted)
	response := JSONResponse{
		Message: "successfully logged out",
	}
	_ = app.writeJSON(w, http.StatusOK, response)
}

// User Handlers

func (app *application) RegisterNewUser(w http.ResponseWriter, r *http.Request) {

	newUser := models.User{ID: uuid.NewString()}
	err := app.readJSON(w, r, &newUser)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	hashedPassword, err := hashPassword(newUser.Password)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	newUser.Password = hashedPassword

	err = app.Repository.CreateUser(&newUser)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	response := JSONResponse{
		Error:   false,
		Message: "user successfully created",
	}
	_ = app.writeJSON(w, http.StatusCreated, response)

	userMode := models.Mode{
		Name:   "1212",
		UserID: newUser.ID,
	}
	err = app.Repository.CreateMode(&userMode)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) GetUserByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "user_id")
	fmt.Println(idParam)

	errChan := make(chan error)
	userChan := make(chan *models.User)

	go func() {
		user, err := app.Repository.GetUserByID(idParam)
		if err != nil {
			errChan <- err
		} else {
			userChan <- user
		}
	}()

	select {
	case user := <-userChan:
		_ = app.writeJSON(w, http.StatusOK, user)
	case err := <-errChan:
		app.errorJSON(w, err)
	}
}
