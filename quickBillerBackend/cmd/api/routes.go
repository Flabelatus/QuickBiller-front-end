package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() http.Handler {
	mux := chi.NewRouter()
	mux.Use(middleware.Recoverer)
	mux.Use(middleware.Logger)
	mux.Use(app.enableCORS)

	mux.Post("/login", app.authenticate)
	mux.Post("/refresh", app.refreshToken)
	mux.Post("/register", app.RegisterNewUser)

	// Protected routes
	mux.Route("/logged_in", func(mux chi.Router) {
		mux.Use(app.authRequired)
		mux.Post("/logout", app.logout)
	})

	mux.Route("/admin", func(mux chi.Router) {
		mux.Use(app.adminRequired)

	})

	return mux
}
