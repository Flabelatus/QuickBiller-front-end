package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"quickBiller/internal/models"
	repositories "quickBiller/internal/repository"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const port = 8082

type application struct {
	DSN          string
	Domain       string
	Repository   *repositories.GORMRepo
	auth         Auth
	JWTSecret    string
	JWTAudience  string
	JWTIssuer    string
	CookieDomain string
}

func main() {

	var app application

	// read from command line
	flag.StringVar(
		&app.DSN,
		"dsn",
		"host=localhost port=5432 user=quickBiller password=paswoord dbname=database sslmode=disable timezone=UTC connect_timeout=5",
		"Postgres connection string",
	)
	flag.StringVar(&app.JWTSecret, "jwt-secret", "verysecret", "signing secret")
	flag.StringVar(&app.JWTIssuer, "jwt-issuer", "quickBiller.com", "signing issuer")
	flag.StringVar(&app.JWTAudience, "jwt-audience", "wooquickBillerdpassport.com", "signing audience")
	flag.StringVar(&app.CookieDomain, "cookie-domain", "localhost", "cookie domain")
	flag.StringVar(&app.Domain, "domain", "quickBiller.com", "domain")
	flag.Parse()

	// Initialize the repository
	app.Repository = &repositories.GORMRepo{}

	// Initiate the auth object
	app.auth = Auth{
		Issuer:        app.JWTIssuer,
		Audience:      app.JWTAudience,
		Secret:        app.JWTSecret,
		TokenExpiry:   time.Minute * 15,
		RefreshExpiry: time.Hour * 24,
		CookiePath:    "/",
		CookieName:    "refresh_token",
		CookieDomain:  app.CookieDomain,
	}

	// Open database
	var err error
	app.Repository.DB, err = gorm.Open(postgres.Open(app.DSN), &gorm.Config{})
	if err != nil {
		fmt.Println(err)
		return
	}

	// Migrate the Schema
	err = app.Repository.Migrate()
	if err != nil {
		log.Println(err)
		return
	}

	// Create Admin User
	hashedPassword, err := hashPassword("changeMe")
	if err != nil {
		log.Fatal(err)
		return
	}

	admin := models.User{
		UserName: "Admin",
		Email:    "admin@example.com",
		Password: hashedPassword,
	}
	mode := models.Mode{
		Name:   "admin",
		UserID: 1,
	}

	adminUser, _ := app.Repository.GetUserByEmail("admin@example.com")

	if adminUser == nil {
		err = app.Repository.CreateAdminUser(&admin)
		if err != nil {
			log.Fatal(err)
			return
		}
		err = app.Repository.CreateMode(&mode)
		if err != nil {
			log.Fatal(err)
			return
		}
	}

	// Starting the webserver
	log.Println("Starting the application on port: 8082")
	err = http.ListenAndServe(fmt.Sprintf("localhost:%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
		return
	}
}
