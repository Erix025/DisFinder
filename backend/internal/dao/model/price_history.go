package model

import "gopkg.in/guregu/null.v4"

type PriceHistory struct {
	ProductID uint      `json:"product_id" gorm:"column:product_id;type:int;not null;primary_key"`
	Date      null.Time `json:"date" gorm:"column:date;type:date;not null;primary_key"`
	Price     float64   `json:"price" gorm:"column:price;type:decimal(10,2);not null"`
}
