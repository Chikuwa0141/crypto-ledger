package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"crypto-ledger-backend/db"
	"crypto-ledger-backend/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestCreateZeroPriceTransaction(t *testing.T) {
	// Setup in-memory DB
	var err error
	db.DB, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to connect to database: %v", err)
	}
	db.DB.AutoMigrate(&models.Transaction{})

	e := echo.New()
	reqBody := `{"symbol": "ETH", "amount": 0.1, "price_at_purchase": 0, "purchased_at": "2023-10-27T10:00:00Z"}`
	req := httptest.NewRequest(http.MethodPost, "/api/transactions", bytes.NewBufferString(reqBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, CreateTransaction(c)) {
		assert.Equal(t, http.StatusCreated, rec.Code)

		var createdTx models.Transaction
		json.Unmarshal(rec.Body.Bytes(), &createdTx)
		assert.Equal(t, 0.0, createdTx.PriceAtPurchase)
		assert.Equal(t, 0.1, createdTx.Amount)
	}
}
