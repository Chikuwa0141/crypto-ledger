package models

import (
	"time"
)

type DailyPrice struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Symbol    string    `gorm:"type:varchar(10);not null;uniqueIndex:unique_symbol_date" json:"symbol"`
	Price     float64   `gorm:"type:decimal(18,2);not null" json:"price"`
	Date      time.Time `gorm:"type:date;not null;uniqueIndex:unique_symbol_date" json:"date"`
	CreatedAt time.Time `json:"created_at"`
}
