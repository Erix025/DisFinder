package controller

import (
	"disfinder-backend/api/dto"
	"disfinder-backend/internal/dao"
	"disfinder-backend/internal/dao/model"
	"disfinder-backend/utils/stacktrace"
	"github.com/gin-gonic/gin"
)

type IWishlistController interface {
	GetWishlist(c *gin.Context, req *dto.WishlistGetReq) (*dto.WishlistGetResp, error)
	AddProduct(c *gin.Context, req *dto.WishlistAddProductReq) error
	DeleteProduct(c *gin.Context, req *dto.WishlistDeleteProductReq) error
	ClearWishlist(c *gin.Context) error
}

var _ IWishlistController = (*WishlistController)(nil)

type WishlistController struct {
}

func NewWishlistController() *WishlistController {
	return &WishlistController{}
}

func (p *WishlistController) GetWishlist(c *gin.Context, req *dto.WishlistGetReq) (*dto.WishlistGetResp, error) {
	var resp dto.WishlistGetResp
	// get user id
	UserID := c.GetUint("UserID")
	var products []model.Product
	var condition model.Wishlist
	condition.UserID = UserID
	// FIXME: I'm not sure if this is the correct way to get the products from the wishlist
	err := dao.DB(c).Preload("Wishlists.Product").Where(&condition).Find(&products).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Failed to get wishlist")
	}
	for _, product := range products {
		_ = append(resp.Products, dto.WishlistGetItem{
			ID:      product.ID,
			Name:    product.Name,
			Picture: product.Picture,
			URL:     product.URL,
		})
	}
	return &resp, nil
}

func (p *WishlistController) AddProduct(c *gin.Context, req *dto.WishlistAddProductReq) error {
	// get User ID
	UserID := c.GetUint("UserID")
	// get product ID
	ProductID := req.ID
	wishlist := model.Wishlist{
		UserID:    UserID,
		ProductID: ProductID,
	}
	// check if the product is already in the wishlist
	err := dao.DB(c).Where(&wishlist).First(&wishlist).Error
	if err == nil {
		return stacktrace.PropagateWithCode(err, dto.ErrProductExist, "Product is already in the wishlist")
	}
	// add product to wishlist
	err = dao.DB(c).Create(&wishlist).Error
	if err != nil {
		return stacktrace.PropagateWithCode(err, dto.InternalError, "Failed to add product to wishlist")
	}
	return nil
}

func (p *WishlistController) DeleteProduct(c *gin.Context, req *dto.WishlistDeleteProductReq) error {
	// get User ID
	UserID := c.GetUint("UserID")
	// get product ID
	ProductID := req.ID
	wishlist := model.Wishlist{
		UserID:    UserID,
		ProductID: ProductID,
	}
	// check if the product is in the wishlist
	err := dao.DB(c).Where(&wishlist).First(&wishlist).Error
	if err != nil {
		return stacktrace.PropagateWithCode(err, dto.ErrProductNotFound, "Product is not in the wishlist")
	}
	// delete product from wishlist
	err = dao.DB(c).Delete(&wishlist).Error
	if err != nil {
		return stacktrace.PropagateWithCode(err, dto.InternalError, "Failed to delete product from wishlist")
	}
	return nil
}

func (p *WishlistController) ClearWishlist(c *gin.Context) error {
	// get User ID
	UserID := c.GetUint("UserID")
	wishlist := model.Wishlist{
		UserID: UserID,
	}
	// delete all products from wishlist
	err := dao.DB(c).Where(&wishlist).Delete(&wishlist).Error
	if err != nil {
		return stacktrace.PropagateWithCode(err, dto.InternalError, "Failed to clear wishlist")
	}
	return nil
}
