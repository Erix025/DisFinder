package dto

type Platform struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

type PlatformGetListResp struct {
	Platforms []Platform `json:"platforms"`
}

type PlatformGetNameResp struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
