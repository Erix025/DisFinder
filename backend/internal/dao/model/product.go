package model

type Product struct {
	ID          uint   `json:"id" gorm:"column:id;primary_key;AUTO_INCREMENT"`
	Name        string `json:"name" gorm:"column:name;type:varchar(255);not null"`
	Description string `json:"description" gorm:"column:description;type:varchar(1023);not null"`
	Picture     string `json:"picture" gorm:"column:picture;type:varchar(255);not null"`
	Users       []User `json:"users" gorm:"many2many:wishlists;"`
}
