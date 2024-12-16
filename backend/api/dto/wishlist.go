package dto

type WishlistAddProductReq struct {
	ID uint `json:"id"`
}

type WishlistDeleteProductReq struct {
	ID uint `json:"id"`
}

type WishlistGetReq struct {
	PageSize int `form:"page_size"`
	PageNum  int `form:"page_num"`
}

type WishlistGetItem struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	URL     string `json:"url"`
}

type WishlistGetResp struct {
	Products []WishlistGetItem `json:"products"`
	Total    int64             `json:"total"`
}
