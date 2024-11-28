package model

type User struct {
	ID        uint           `json:"id" gorm:"column:id;primary_key;AUTO_INCREMENT"`
	Name      string         `json:"name" gorm:"column:name;type:varchar(255);not null"`
	Password  string         `json:"password" gorm:"column:password;type:varchar(255);not null"`
	Email     string         `json:"email" gorm:"column:email;type:varchar(255);unique;not null"`
	Platforms []UserPlatform `json:"platform" gorm:"foreignKey:UserID"`
}
