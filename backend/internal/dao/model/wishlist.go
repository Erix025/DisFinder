package model

type Wishlist struct {
	UserID    uint    `json:"user_id" gorm:"primaryKey"`
	ProductID uint    `json:"product_id" gorm:"primaryKey"`
	User      User    `gorm:"foreignKey:UserID"`
	Product   Product `gorm:"foreignKey:ProductID"`
}
