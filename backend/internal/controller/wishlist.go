package controller

import (
	"disfinder-backend/api/dto"
	"github.com/gin-gonic/gin"
)

type IWishlistController interface {
	GetWishlist(c *gin.Context) (*dto.WishlistGetResp, error)
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

func (p *WishlistController) GetWishlist(c *gin.Context) (*dto.WishlistGetResp, error) {
	var resp dto.WishlistGetResp
	return &resp, nil
}

func (p *WishlistController) AddProduct(c *gin.Context, req *dto.WishlistAddProductReq) error {
	return nil
}

func (p *WishlistController) DeleteProduct(c *gin.Context, req *dto.WishlistDeleteProductReq) error {
	return nil
}

func (p *WishlistController) ClearWishlist(c *gin.Context) error {
	return nil
}
