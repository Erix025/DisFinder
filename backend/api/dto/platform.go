package dto

type Platform struct {
	Id   int32  `json:"id"`
	Name string `json:"name"`
}

type PlatformGetListResp struct {
	Platforms []Platform `json:"platforms"`
}

type PlatformGetNameResp struct {
	Id   int32  `json:"id"`
	Name string `json:"name"`
}
