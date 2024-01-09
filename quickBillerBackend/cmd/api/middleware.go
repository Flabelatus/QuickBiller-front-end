package main

import (
	"net/http"
)

func (app *application) enableCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, X-Auth-Email, X-Auth-Key, X-CSRF-Token, Origin, X-Requested-With, Authorization")
			return
		} else {
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			h.ServeHTTP(w, r)
		}
	})
}

func (app *application) authRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _, err := app.auth.GetTokenFromHeaderAndVerify(w, r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// func (app *application) adminRequired(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		_, claims, err := app.auth.GetTokenFromHeaderAndVerify(w, r)
// 		if err != nil {
// 			w.WriteHeader(http.StatusUnauthorized)
// 			return
// 		}

// 		isAdmin, err := app.isUserAdmin(claims.Subject)
// 		if err != nil {
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}

// 		if !isAdmin {
// 			w.WriteHeader(http.StatusForbidden)
// 			return
// 		}

// 		next.ServeHTTP(w, r)
// 	})
// }

// // Helper function to check if the user is an admin
// func (app *application) isUserAdmin(userID string) (bool, error) {
// 	IntegerUserID, err := strconv.Atoi(userID)
// 	if err != nil {
// 		return false, err
// 	}
// 	user, err := app.Repository.GetUserByID(uint(IntegerUserID))
// 	if err != nil {
// 		return false, err
// 	}
// 	return user.Mode.Name == "admin", nil
// }
