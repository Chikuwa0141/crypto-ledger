package handlers

import (
	"net/http"
	"time"

	"crypto-ledger-backend/db"
	"crypto-ledger-backend/models"

	"github.com/labstack/echo/v4"
)

type PortfolioPoint struct {
	Date            string  `json:"date"`
	TotalValue      float64 `json:"total_value"`
	TotalInvestment float64 `json:"total_investment"`
	BTCValue        float64 `json:"btc_value"`
	ETHValue        float64 `json:"eth_value"`
}

func GetPortfolioHistory(c echo.Context) error {
	// 1. Fetch all transactions
	var transactions []models.Transaction
	if err := db.DB.Order("purchased_at asc").Find(&transactions).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch transactions"})
	}

	// 2. Fetch all daily prices
	var prices []models.DailyPrice
	if err := db.DB.Order("date asc").Find(&prices).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch prices"})
	}

	// Organize prices by date and symbol
	priceMap := make(map[string]map[string]float64) // date -> symbol -> price
	for _, p := range prices {
		dateStr := p.Date.Format("2006-01-02")
		if _, ok := priceMap[dateStr]; !ok {
			priceMap[dateStr] = make(map[string]float64)
		}
		priceMap[dateStr][p.Symbol] = p.Price
	}

	// 3. Calculate daily portfolio value
	// Determine date range (from first transaction or 1 year ago)
	if len(transactions) == 0 {
		return c.JSON(http.StatusOK, []PortfolioPoint{})
	}

	startDate := transactions[0].PurchasedAt
	// Normalize to start of day
	startDate = time.Date(startDate.Year(), startDate.Month(), startDate.Day(), 0, 0, 0, 0, startDate.Location())

	endDate := time.Now()

	var history []PortfolioPoint

	// Iterate through each day
	for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
		dateStr := d.Format("2006-01-02")

		// Calculate holdings up to this day
		holdings := make(map[string]float64)
		totalInvestment := 0.0

		for _, t := range transactions {
			// If transaction happened on or before this day
			if !t.PurchasedAt.After(d.Add(24*time.Hour - 1*time.Second)) {
				holdings[t.Symbol] += t.Amount
				totalInvestment += t.Amount * t.PriceAtPurchase
			}
		}

		// Calculate total value using price of this day
		totalValue := 0.0
		btcValue := 0.0
		ethValue := 0.0

		dailyPrices, hasPrices := priceMap[dateStr]

		if hasPrices {
			for symbol, amount := range holdings {
				if price, ok := dailyPrices[symbol]; ok {
					val := amount * price
					totalValue += val
					if symbol == "BTC" {
						btcValue = val
					} else if symbol == "ETH" {
						ethValue = val
					}
				} else {
					// Fallback: use latest known price if missing (omitted for simplicity, but could be improved)
					// For now, if price is missing, value is 0 for that asset (or maybe use previous day's price)
				}
			}
		}

		history = append(history, PortfolioPoint{
			Date:            dateStr,
			TotalValue:      totalValue,
			TotalInvestment: totalInvestment,
			BTCValue:        btcValue,
			ETHValue:        ethValue,
		})
	}

	return c.JSON(http.StatusOK, history)
}
