package main

import (
	"net/http"
	"log"
)

func main() {
    fileServer := http.FileServer(http.Dir("./js"))
	http.Handle("/js/", http.StripPrefix("/js/", fileServer))
	
	http.Handle("/", http.FileServer(http.Dir("./pages")))
	log.Println("Server running at http://localhost:3000")
    http.ListenAndServe(":3000", nil)	
}

