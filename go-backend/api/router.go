package api

import (
	"net/http"
)

// NewRouter sets up the routes and returns the primary handler
func NewRouter() http.Handler {
	mux := http.NewServeMux()

	// Register Routes
	mux.HandleFunc("GET /health", healthCheckHandler)
	mux.HandleFunc("GET /users/{id}", getUserHandler)
	mux.HandleFunc("POST /users", createUserHandler)

	// Wrap the mux in middleware
	return loggingMiddleware(mux)
}

// Handlers (keep these private to the package if they don't need to be exported)
func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"status": "ok"}`))
}

func getUserHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	w.Write([]byte("User ID: " + id))
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"message": "user created"}`))
}

// Middleware
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Log logic here
		next.ServeHTTP(w, r)
	})
}
