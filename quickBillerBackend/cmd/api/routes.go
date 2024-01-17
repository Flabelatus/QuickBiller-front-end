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
		mux.Get("/client_list/{user_id}", app.GetCompanyDataListByUserID)
		mux.Get("/client/{client_id}", app.GetClientByID)
		mux.Post("/add_client", app.InsertClient)
		mux.Get("/user/{user_id}", app.GetUserByID)
	})

	mux.Route("/admin", func(mux chi.Router) {
		mux.Use(app.adminRequired)

	})

	return mux
}
