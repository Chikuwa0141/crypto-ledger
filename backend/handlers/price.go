package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"crypto-ledger-backend/db"
	"crypto-ledger-backend/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm/clause"
)

const (
	CoinGeckoBaseURL = "https://api.coingecko.com/api/v3"
)

type CoinGeckoMarketChart struct {
	Prices [][]float64 `json:"prices"` // [timestamp, price]
}

func SyncPrices(c echo.Context) error {
	coins := map[string]string{
		"BTC": "bitcoin",
		"ETH": "ethereum",
	}

	// Sync last 365 days
	to := time.Now().Unix()
	from := time.Now().AddDate(-1, 0, 0).Unix()

	for symbol, id := range coins {
		url := fmt.Sprintf("%s/coins/%s/market_chart/range?vs_currency=jpy&from=%d&to=%d", CoinGeckoBaseURL, id, from, to)

		resp, err := http.Get(url)
		if err != nil {
			log.Printf("Failed to fetch prices for %s: %v", symbol, err)
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			body, _ := io.ReadAll(resp.Body)
			log.Printf("CoinGecko API error for %s: %s", symbol, string(body))
			continue
		}

		var data CoinGeckoMarketChart
		if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
			log.Printf("Failed to decode response for %s: %v", symbol, err)
			continue
		}

		log.Printf("Fetched %d prices for %s", len(data.Prices), symbol)

		for _, p := range data.Prices {
			// p[0] is timestamp in ms, p[1] is price
			timestamp := int64(p[0]) / 1000
			price := p[1]
			date := time.Unix(timestamp, 0)

			dailyPrice := models.DailyPrice{
				Symbol: symbol,
				Price:  price,
				Date:   date,
			}

			// Upsert (On Duplicate Key Update)
			// Using GORM's Clauses
			db.DB.Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "symbol"}, {Name: "date"}},
				DoUpdates: clause.AssignmentColumns([]string{"price"}),
			}).Create(&dailyPrice)
		}

		// Sleep to avoid rate limits (CoinGecko free tier is 10-30 req/min)
		time.Sleep(5 * time.Second)
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Prices synced successfully"})
}
