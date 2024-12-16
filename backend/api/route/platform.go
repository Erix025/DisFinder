package route

import (
	"disfinder-backend/api/dto"
	"disfinder-backend/internal/controller"

	"github.com/gin-gonic/gin"
)

func setupPlatformRoutes(r *gin.RouterGroup) {
	cw := PlatformCtlWrapper{
		ctl: controller.NewPlatformController(),
	}
	p := r.Group("/platform")
	p.GET("/list", cw.GetPlatformList)
	p.GET("/get", cw.GetPlatform)
}

type PlatformCtlWrapper struct {
	ctl controller.IPlatformController
}

func (w *PlatformCtlWrapper) GetPlatformList(c *gin.Context) {
	resp, err := w.ctl.GetPlatformList(c)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, resp)
}

func (w *PlatformCtlWrapper) GetPlatform(c *gin.Context) {
	var req dto.PlatformGetNameReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	resp, err := w.ctl.GetPlatform(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, resp)
}
