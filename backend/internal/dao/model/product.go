package model

type Product struct {
	ID      uint   `json:"id" gorm:"column:id;primary_key;AUTO_INCREMENT"`
	Name    string `json:"name" gorm:"column:name;type:varchar(255);not null;unique"`
	Picture string `json:"picture" gorm:"column:picture;type:text;not null"`
	URL     string `json:"url" gorm:"column:url;type:text;not null"`
}
