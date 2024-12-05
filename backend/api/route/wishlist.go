package route

import (
	"disfinder-backend/api/dto"
	"disfinder-backend/internal/controller"

	"github.com/gin-gonic/gin"
)

func setupWishlistController(r *gin.RouterGroup) {
	cw := WishlistCtlWrapper{ctl: controller.NewWishlistController()}
	r.GET("/wishlist", cw.GetWishlist)
	r.POST("/wishlist/add", cw.AddProduct)
	r.POST("/wishlist/delete", cw.DeleteProduct)
	r.POST("/wishlist/clear", cw.ClearWishlist)
}

type WishlistCtlWrapper struct {
	ctl controller.IWishlistController
}

func (w *WishlistCtlWrapper) GetWishlist(c *gin.Context) {
	var req dto.WishlistGetReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	resp, err := w.ctl.GetWishlist(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, resp)
}

func (w *WishlistCtlWrapper) AddProduct(c *gin.Context) {
	var req dto.WishlistAddProductReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	err := w.ctl.AddProduct(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, nil)
}

func (w *WishlistCtlWrapper) DeleteProduct(c *gin.Context) {
	var req dto.WishlistDeleteProductReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	err := w.ctl.DeleteProduct(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, nil)
}

func (w *WishlistCtlWrapper) ClearWishlist(c *gin.Context) {
	err := w.ctl.ClearWishlist(c)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, nil)
}
