package dto

type WishlistAddProductReq struct {
	Id int32 `json:"id"`
}

type WishlistDeleteProductReq struct {
	Id int32 `json:"id"`
}

type WishlistGetItem struct {
	Id      int32  `json:"id"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	URL     string `json:"url"`
}

type WishlistGetReq struct {
	Products []WishlistGetItem `json:"products"`
}
