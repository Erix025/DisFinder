package dto

type WishlistAddProductReq struct {
	ID uint `json:"id"`
}

type WishlistDeleteProductReq struct {
	ID uint `json:"id"`
}

type WishlistGetItem struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	URL     string `json:"url"`
}

type WishlistGetResp struct {
	Products []WishlistGetItem `json:"products"`
}
