package main

import (
	"net/http"
	"log"
)

func main() {
    fs := http.FileServer(http.Dir("./assets"))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs)) 
	
	http.Handle("/", http.FileServer(http.Dir("./pages")))
	log.Println("Server running at http://localhost:3000")
    http.ListenAndServe(":3000", nil)	
}

