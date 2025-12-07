package models

import (
	"time"
)

type Transaction struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Symbol          string    `gorm:"type:varchar(10);not null" json:"symbol"`
	Amount          float64   `gorm:"type:decimal(18,8);not null" json:"amount"`
	PriceAtPurchase float64   `gorm:"type:decimal(18,2);not null" json:"price_at_purchase"`
	PurchasedAt     time.Time `gorm:"not null" json:"purchased_at"`
	CreatedAt       time.Time `json:"created_at"`
}
