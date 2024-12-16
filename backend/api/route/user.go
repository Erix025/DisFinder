package route

import (
	"disfinder-backend/api/dto"
	"disfinder-backend/internal/controller"

	"github.com/gin-gonic/gin"
)

func setupUserController(r *gin.RouterGroup) {
	cw := UserCtlWrapper{
		ctl: controller.NewUserController(),
	}
	p := r.Group("/user")
	p.POST("/register", cw.Register)
	p.POST("/login", cw.Login)
	p.POST("/logout", controller.AuthMidWare(), cw.Logout)
	p.GET("/info", controller.AuthMidWare(), cw.GetInfo)
	p.POST("/info", controller.AuthMidWare(), cw.UpdateInfo)
	p.POST("/passwd", controller.AuthMidWare(), cw.UpdatePwd)
}

type UserCtlWrapper struct {
	ctl controller.IUserController
}

func (w *UserCtlWrapper) Register(c *gin.Context) {
	var req dto.UserRegisterReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	err := w.ctl.Register(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, nil)
}

func (w *UserCtlWrapper) Login(c *gin.Context) {
	var req dto.UserLoginReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	err := w.ctl.Login(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, nil)
}

func (w *UserCtlWrapper) Logout(c *gin.Context) {
	err := w.ctl.Logout(c)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, nil)
}

func (w *UserCtlWrapper) GetInfo(c *gin.Context) {
	resp, err := w.ctl.GetInfo(c)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, resp)
}

func (w *UserCtlWrapper) UpdateInfo(c *gin.Context) {
	var req dto.UserUpdateInfoReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	err := w.ctl.UpdateInfo(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, nil)
}

func (w *UserCtlWrapper) UpdatePwd(c *gin.Context) {
	var req dto.UserUpdatePasswordReq
	if err := dto.BindReq(c, &req); err != nil {
		dto.ResponseFail(c, err)
		return
	}
	err := w.ctl.UpdatePwd(c, &req)
	if err != nil {
		dto.ResponseFail(c, err)
		return
	}
	dto.ResponseSuccess(c, nil)
}
