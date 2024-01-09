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

	// Protected routes
	mux.Route("/logged_in", func(mux chi.Router) {
		mux.Use(app.authRequired)

	})

	mux.Route("/admin", func(mux chi.Router) {
		// mux.Use(app.adminRequired)

	})

	return mux
}
