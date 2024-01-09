package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

type JSONResponse struct {
	Error   bool        `json:"error"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func (app *application) writeJSON(w http.ResponseWriter, status int, payload interface{}, headers ...http.Header) error {
	out, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	if len(headers) > 0 {
		for key, value := range headers[0] {
			w.Header()[key] = value
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err = w.Write(out)
	if err != nil {
		return err
	}
	return nil
}

func (app *application) readJSON(w http.ResponseWriter, r *http.Request, payload interface{}) error {
	maxBytes := 1024 * 1024
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	err := decoder.Decode(payload)
	if err != nil {
		return err
	}
	err = decoder.Decode(&struct{}{})
	if err != io.EOF {
		return errors.New("body must contain only a single JSON value")
	}
	return nil
}

func (app *application) errorJSON(w http.ResponseWriter, err error, status ...int) error {
	statusCode := http.StatusBadRequest
	if len(status) > 0 {
		statusCode = status[0]
	}

	var payload JSONResponse
	payload.Error = true
	if err != nil {
		payload.Message = err.Error()
	}

	return app.writeJSON(w, statusCode, payload)
}

func (app *application) pythonExec(path string, args ...string) error {

	// Set the working directory to the directory containing the Python script
	workingDirectory := filepath.Dir(path)
	err := os.Chdir(workingDirectory)
	if err != nil {
		return fmt.Errorf("failed to change working directory: %v", err)
	}

	// Check if the lock file exists
	_, err = os.Stat("./internal/python_scripts/Pipfile.lock")
	if err != nil {
		// Install the dependencies using pipenv if the lock file does not exist
		pipenvCmd := exec.Command("pipenv", "install")
		pipenvCmd.Stdout = os.Stdout
		pipenvCmd.Stderr = os.Stderr
		err = pipenvCmd.Run()
		if err != nil {
			return fmt.Errorf("failed to install Python dependencies: %v", err)
		}
	}

	command := exec.Command("python", append([]string{"./internal/python_scripts/" + path}, args...)...)
	output, err := command.CombinedOutput()
	if err != nil {
		return fmt.Errorf("error executing python script %v", err)
	}
	fmt.Println("script output:", string(output))
	return nil
}
