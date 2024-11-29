package controller

import (
	"disfinder-backend/api/dto"
	"github.com/gin-gonic/gin"
)

type IProductController interface {
	GetInfo(*gin.Context) (*dto.ProductGetInfoResp, error)
	Search(*gin.Context, *dto.ProductSearchReq) (*dto.ProductSearchResp, error)
	GetHistory(*gin.Context, *dto.ProductGetHistoryReq) (*dto.ProductGetHistoryResp, error)
}

var _ IProductController = (*ProductController)(nil)

type ProductController struct {
}

func NewProductController() *ProductController {
	return &ProductController{}
}

func (p *ProductController) GetInfo(c *gin.Context) (*dto.ProductGetInfoResp, error) {
	var resp dto.ProductGetInfoResp
	return &resp, nil
}

func (p *ProductController) Search(c *gin.Context, req *dto.ProductSearchReq) (*dto.ProductSearchResp, error) {
	var resp dto.ProductSearchResp
	return &resp, nil
}

func (p *ProductController) GetHistory(c *gin.Context, req *dto.ProductGetHistoryReq) (*dto.ProductGetHistoryResp, error) {
	var resp dto.ProductGetHistoryResp
	return &resp, nil
}
