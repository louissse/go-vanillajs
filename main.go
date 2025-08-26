package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"frontendmasters.com/reelingit/data"
	"frontendmasters.com/reelingit/handlers"
	"frontendmasters.com/reelingit/logger"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func initializeLogger() *logger.Logger {
	logInstance, err := logger.NewLogger("movie.log")
	//logInstance.Error("Hello from the logger system", nil)
	if err != nil {
		log.Fatalf("Could not initialize logger %v", err)
	}
	defer logInstance.Close()
	return logInstance
}

func main() {

	// Initialize the logger
	logInstance := initializeLogger()

	//Environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Connect to DB
	dbConnStr := os.Getenv("DATABASE_URL")
	if dbConnStr == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}
	db, err := sql.Open("postgres", dbConnStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	//Initialize Data Repository for Movies
	movieRepo, err := data.NewMovieRepository(db, logInstance)
	if err != nil {
		log.Fatalf("Failed to initialized repository: %v", err)
	}

	// Initialize Account Repository
	accountRepo, err := data.NewAccountRepository(db, logInstance)
	if err != nil {
		log.Fatalf("Failed to initialize account repository: %v", err)
	}

	// Movie handler initialization
	movieHandler := handlers.NewMovieHandler(movieRepo, logInstance)

	// Account handler initialization
	accountHandler := handlers.NewAccountHandler(accountRepo, logInstance)

	// Handler for getting movies
	http.HandleFunc("/api/movies/top/", movieHandler.GetTopMovies)
	http.HandleFunc("/api/movies/random/", movieHandler.GetRandomMovies)
	http.HandleFunc("/api/movies/search/", movieHandler.SearchMovies)
	http.HandleFunc("/api/movies/", movieHandler.GetMovie) // api/movies/{id}
	http.HandleFunc("/api/genres/", movieHandler.GetGenres)
	// Handlers for account management
	http.HandleFunc("/api/account/register/", accountHandler.Register)
	http.HandleFunc("/api/account/login/", accountHandler.Authenticate)

	// Protected routes
	http.Handle("/api/account/favorites/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.GetFavorites)))

	http.Handle("/api/account/watchlist/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.GetWatchlist)))

	http.Handle("/api/account/save-to-collection/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.SaveToCollection)))

	catchAllClientRoutesHandler := func(w http.ResponseWriter, r *http.Request) {
		// 1) HTTP Redirect 301/302 (Not the right way)
		// 2) Deliver the index.html file'
		http.ServeFile(w, r, "./public/index.html")
	}

	http.HandleFunc("/movies", catchAllClientRoutesHandler)
	http.HandleFunc("/movies/", catchAllClientRoutesHandler)
	http.HandleFunc("/account/", catchAllClientRoutesHandler)


	// Handler for static files (frontend) (needs to be at the end))
	http.Handle("/", http.FileServer(http.Dir("public")))

	// Set up a simple route to handle requests to the root path
	const addr = ":8080"
	err = http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatalf("Server failed: %v", err)
		logInstance.Error("Server failed", err)
	}
}