package model

type UserPlatform struct {
	UserID     uint   `json:"user_id" gorm:"column:user_id;type:int;not null"`
	PlatformID uint   `json:"platform_id" gorm:"column:platform_id;type:int;not null"`
	Account    string `json:"account" gorm:"column:account;type:varchar(255);not null"`
	Password   string `json:"password" gorm:"column:password;type:varchar(255);not null"`
}
