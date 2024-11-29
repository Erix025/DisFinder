package dto

type ProductInfo struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	URL     string `json:"url"`
}

type ProductGetHistoryReq struct {
	ProductId uint `json:"product_id"`

	PlatformId uint `json:"platform_id"`

	StartDate string `json:"start_date"`

	EndDate string `json:"end_date"`
}

type ProductSearchReq struct {
	Keyword string `json:"keyword"`

	PageNum uint `json:"page_num"`

	PageSize uint `json:"page_size"`
}

type ProductGetInfoResp struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	URL     string `json:"url"`
}

type ProductSearchResp struct {
	Products []ProductInfo `json:"products"`
}

type ProductHistoryItem struct {
	ProductID  uint    `json:"product_id"`
	PlatformID uint    `json:"platform_id"`
	Date       string  `json:"date"`
	Price      float64 `json:"price"`
}

type ProductGetHistoryResp struct {
	History []ProductHistoryItem `json:"history"`
}
