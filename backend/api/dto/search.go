package dto

type SearchItem struct {
	Title      string  `json:"title"`
	Price      float64 `json:"price"`
	Image      string  `json:"image"`
	URL        string  `json:"url"`
	PlatformID uint    `json:"platform"`
}

type SearchResp struct {
	Code int          `json:"code"`
	Msg  string       `json:"msg"`
	Data []SearchItem `json:"data"`
}
