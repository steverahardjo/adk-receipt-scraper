package api

import (
	"fmt"
	http "net/http"
	"strings"
)

// Server holds our router and configuration
type Server struct {
	mux    *http.ServeMux
	port   int
	middle []func(http.Handler) http.Handler
}

// NewBuilder initializes the builder with defaults
func NewBuilder(port int) *Server {
	return &Server{
		mux:  http.NewServeMux(),
		port: port,
	}
}

func (s *Server) AddRoute(method string, version string, path string, handler http.HandlerFunc) *Server {
	fullPath := fmt.Sprintf("%s /%s%s", method, version, path)
	fullPath = strings.ReplaceAll(fullPath, "//", "/")
	s.mux.HandleFunc(fullPath, handler)
	return s
}

// Use adds a middleware to the stack
func (s *Server) Use(mw func(http.Handler) http.Handler) *Server {
	s.middle = append(s.middle, mw)
	return s
}

func (s *Server) Build() http.Handler {
	var handler http.Handler = s.mux
	for i := len(s.middle) - 1; i >= 0; i-- {
		handler = s.middle[i](handler)
	}
	return handler
}

// Run starts the server
func (s *Server) Run() error {
	finalHandler := s.Build()
	fmt.Printf("Server starting on :%d\n", s.port)
	return http.ListenAndServe(fmt.Sprintf(":%d", s.port), finalHandler)
}
