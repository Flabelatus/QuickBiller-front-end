package main

import (
	"io"
	"net/http"
	"os"
	"path/filepath"
	"quickBiller/internal/models"

	"github.com/go-chi/chi/v5"
)

func (app *application) UploadImage(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("uID")
	file, handler, err := r.FormFile("image")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	defer file.Close()

	filename := userID + filepath.Ext(handler.Filename)
	filepath := "./static/" + filename
	newFile, err := os.Create(filepath)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, file)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	image := models.Image{Filename: filename, FilePath: filepath, UserID: userID}
	imageID, err := app.Repository.InsertImage(&image)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	response := JSONResponse{Data: imageID, Message: "image successfully uploaded"}
	_ = app.writeJSON(w, http.StatusCreated, response)
}

func (app *application) ServeStaticImage(w http.ResponseWriter, r *http.Request) {
	imageName := chi.URLParam(r, "image_name")
	logo, err := app.Repository.GetLogoByImageName(imageName)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	filename := logo.Filename
	staticDir := "./static"
	filePath := filepath.Join(staticDir, filename)
	http.ServeFile(w, r, filePath)
}

func (app *application) GetLogoByImageName(w http.ResponseWriter, r *http.Request) {
	imageName := chi.URLParam(r, "image_name")
	image, err := app.Repository.GetLogoByImageName(imageName)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{Data: image}
	_ = app.writeJSON(w, http.StatusOK, resp)
}

func (app *application) GetLogoByUserID(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "user_id")
	image, err := app.Repository.GetLogoByUserID(userID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{Data: image}
	_ = app.writeJSON(w, http.StatusOK, resp)
}
