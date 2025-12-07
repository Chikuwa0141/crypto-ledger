package handlers

import (
	"net/http"
	"time"

	"crypto-ledger-backend/db"
	"crypto-ledger-backend/models"

	"github.com/labstack/echo/v4"
)

func GetTransactions(c echo.Context) error {
	var transactions []models.Transaction
	if err := db.DB.Order("purchased_at desc").Find(&transactions).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch transactions"})
	}
	return c.JSON(http.StatusOK, transactions)
}

type CreateTransactionRequest struct {
	Symbol          string  `json:"symbol"`
	Amount          float64 `json:"amount"`
	PriceAtPurchase float64 `json:"price_at_purchase"`
	PurchasedAt     string  `json:"purchased_at"` // Expecting ISO 8601 string
}

func CreateTransaction(c echo.Context) error {
	req := new(CreateTransactionRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	purchasedAt, err := time.Parse(time.RFC3339, req.PurchasedAt)
	if err != nil {
		// Try parsing YYYY-MM-DD
		purchasedAt, err = time.Parse("2006-01-02", req.PurchasedAt)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid date format. Use ISO 8601 or YYYY-MM-DD"})
		}
	}

	transaction := models.Transaction{
		Symbol:          req.Symbol,
		Amount:          req.Amount,
		PriceAtPurchase: req.PriceAtPurchase,
		PurchasedAt:     purchasedAt,
	}

	if err := db.DB.Create(&transaction).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create transaction"})
	}

	return c.JSON(http.StatusCreated, transaction)
}

func DeleteTransaction(c echo.Context) error {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Transaction{}, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete transaction"})
	}
	return c.NoContent(http.StatusNoContent)
}

func UpdateTransaction(c echo.Context) error {
	id := c.Param("id")
	var transaction models.Transaction
	if err := db.DB.First(&transaction, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Transaction not found"})
	}

	req := new(CreateTransactionRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	purchasedAt, err := time.Parse(time.RFC3339, req.PurchasedAt)
	if err != nil {
		purchasedAt, err = time.Parse("2006-01-02", req.PurchasedAt)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid date format"})
		}
	}

	transaction.Symbol = req.Symbol
	transaction.Amount = req.Amount
	transaction.PriceAtPurchase = req.PriceAtPurchase
	transaction.PurchasedAt = purchasedAt

	if err := db.DB.Save(&transaction).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update transaction"})
	}

	return c.JSON(http.StatusOK, transaction)
}
