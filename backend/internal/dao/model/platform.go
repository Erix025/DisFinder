package model

type Platform struct {
	ID   uint   `json:"id" gorm:"column:id;primary_key;AUTO_INCREMENT"`
	Name string `json:"name" gorm:"column:name;type:varchar(255);not null"`
}
