package dto

import "gopkg.in/guregu/null.v4"

type ProductInfo struct {
	ID      uint    `json:"id"`
	Name    string  `json:"name"`
	Picture string  `json:"picture"`
	URL     string  `json:"url"`
	Price   float64 `json:"price"`
}

type ProductGetInfoReq struct {
	ID uint `form:"id"`
}

type ProductGetHistoryReq struct {
	ProductId uint `json:"product_id"`

	StartDate null.Time `json:"start_date"`

	EndDate null.Time `json:"end_date"`
}

type ProductSearchReq struct {
	Keyword string `form:"keyword"`
}

type ProductGetListReq struct {
	Keyword string `form:"keyword"`

	PageNum uint `form:"page_num"`

	PageSize uint `form:"page_size"`
}

type ProductGetInfoResp struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	URL     string `json:"url"`
}

type ProductGetListResp struct {
	Products []ProductInfo `json:"products"`
	Total    int64         `json:"total"`
}

type ProductHistoryItem struct {
	ProductID  uint      `json:"product_id"`
	PlatformID uint      `json:"platform_id"`
	Date       null.Time `json:"date"`
	Price      float64   `json:"price"`
}

type ProductGetHistoryResp struct {
	History []ProductHistoryItem `json:"history"`
}
