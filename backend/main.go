package main

import (
	"net/http"

	"crypto-ledger-backend/db"
	"crypto-ledger-backend/handlers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	db.Init()

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, Crypto Ledger!")
	})

	api := e.Group("/api")
	api.GET("/transactions", handlers.GetTransactions)
	api.POST("/transactions", handlers.CreateTransaction)
	api.DELETE("/transactions/:id", handlers.DeleteTransaction)
	api.PUT("/transactions/:id", handlers.UpdateTransaction)
	api.GET("/portfolio/history", handlers.GetPortfolioHistory)
	api.POST("/prices/sync", handlers.SyncPrices)

	e.Logger.Fatal(e.Start(":8080"))
}
