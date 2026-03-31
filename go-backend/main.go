package main

import (
	"log"
	"net/http"

	api "github.com/steverahardjo/adk-exp_tracker/api"
)

func main() {
	log.Println("[Log] start the expense tracker backend")
	route := api.NewRouter()
	http.ListenAndServe(":8080", route)

}
