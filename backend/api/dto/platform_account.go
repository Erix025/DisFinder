package dto

type PlatformAccountCreateReq struct {
	PlatformId uint `json:"platform_id"`

	Account string `json:"account"`

	Password string `json:"password"`
}

type PlatformAccountDeleteReq struct {
	PlatformId uint `json:"platform_id"`
}

type PlatformAccountGetListItem struct {
	PlatformId uint `json:"platform_id"`

	Account string `json:"account"`
}

type PlatformAccountGetListResp struct {
	Accounts []PlatformAccountGetListItem `json:"accounts"`
}
