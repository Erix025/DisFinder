package route

import (
	"disfinder-backend/api/dto"
	"disfinder-backend/internal/controller"

	"github.com/gin-gonic/gin"
)

func setupProductController(r *gin.RouterGroup) {
	cw := ProductCtlWrapper{
		ctl: controller.NewProductController(),
	}
	p := r.Group("/product")
	p.GET("/info", cw.GetInfo)
	p.POST("/search", cw.Search)
	p.POST("/history", cw.GetHistory)
	p.POST("/list", cw.GetList)
}

type ProductCtlWrapper struct {
	ctl controller.IProductController
}

func (w *ProductCtlWrapper) GetInfo(c *gin.Context) {
	var req dto.ProductGetInfoReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	resp, err := w.ctl.GetInfo(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, resp)
}

func (w *ProductCtlWrapper) Search(c *gin.Context) {
	var req dto.ProductSearchReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	err := w.ctl.Search(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, nil)
}

func (w *ProductCtlWrapper) GetList(c *gin.Context) {
	var req dto.ProductGetListReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	resp, err := w.ctl.GetList(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, resp)
}

func (w *ProductCtlWrapper) GetHistory(c *gin.Context) {
	var req dto.ProductGetHistoryReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	resp, err := w.ctl.GetHistory(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, resp)
}
