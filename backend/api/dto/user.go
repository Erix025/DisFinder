package dto

type UserLoginReq struct {
	Email string `json:"email"`

	Password string `json:"password"`
}

type UserRegisterReq struct {
	Email string `json:"email"`

	Name string `json:"name"`

	Password string `json:"password"`
}

type UserUpdateInfoReq struct {
	Id int32 `json:"id"`

	Name string `json:"name"`

	Email string `json:"email"`
}

type UserUpdatePasswordReq struct {
	Uid int32 `json:"uid"`

	OldPassword string `json:"old_password"`

	NewPassword string `json:"new_password"`
}

type UserGetInfoResp struct {
	Id int32 `json:"id"`

	Name string `json:"name"`

	Email string `json:"email"`
}
