package dto

type ProductInfo struct {
	Id      int32  `json:"id"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	URL     string `json:"url"`
}

type ProductGetHistoryReq struct {
	ProductId int32 `json:"product_id"`

	PlatformId int32 `json:"platform_id"`

	StartDate string `json:"start_date"`

	EndDate string `json:"end_date"`
}

type ProductGetInfoResp struct {
	Id      int32  `json:"id"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	URL     string `json:"url"`
}

type ProductGetListResp struct {
	Products []ProductInfo `json:"products"`
}

type ProductHistoryItem struct {
	ProductID  int32   `json:"product_id"`
	PlatformID int32   `json:"platform_id"`
	Date       string  `json:"date"`
	Price      float64 `json:"price"`
}

type ProductGetPriceHistoryResp struct {
	History []ProductHistoryItem `json:"history"`
}
