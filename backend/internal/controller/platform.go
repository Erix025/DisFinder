package controller

import (
	"disfinder-backend/api/dto"
	"disfinder-backend/internal/dao"
	"disfinder-backend/internal/dao/model"
	"disfinder-backend/utils/stacktrace"
	"github.com/gin-gonic/gin"
)

type IPlatformController interface {
	GetPlatform(c *gin.Context, req *dto.PlatformGetNameReq) (*dto.PlatformGetNameResp, error)
	GetPlatformList(c *gin.Context) (*dto.PlatformGetListResp, error)
}

var _ IPlatformController = (*PlatformController)(nil)

type PlatformController struct {
}

func NewPlatformController() *PlatformController {
	return &PlatformController{}
}

func (p *PlatformController) GetPlatform(c *gin.Context, req *dto.PlatformGetNameReq) (*dto.PlatformGetNameResp, error) {
	// check if req is valid
	if req.ID == 0 {
		return nil, stacktrace.NewErrorWithCode(dto.ErrInvalidRequest, "invalid request")
	}
	// get platform name
	var platform model.Platform
	platform.ID = req.ID
	err := dao.DB(c).Where(&platform).First(&platform).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.ErrPlatformNotFound, "platform not found")
	}
	resp := dto.PlatformGetNameResp{
		ID:   platform.ID,
		Name: platform.Name,
	}
	return &resp, nil
}

func (p *PlatformController) GetPlatformList(c *gin.Context) (*dto.PlatformGetListResp, error) {
	var resp dto.PlatformGetListResp
	// get platform list
	err := dao.DB(c).Find(&resp.Platforms).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "get platform list failed")
	}
	return &resp, nil
}
