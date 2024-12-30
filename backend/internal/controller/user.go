package controller

import (
	"crypto/sha256"
	"disfinder-backend/api/dto"
	"disfinder-backend/internal/dao"
	"disfinder-backend/internal/dao/model"
	"disfinder-backend/utils/stacktrace"
	"errors"
	"fmt"
	"hash"
	"regexp"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type IUserController interface {
	Register(*gin.Context, *dto.UserRegisterReq) error
	Login(*gin.Context, *dto.UserLoginReq) error
	Logout(*gin.Context) error
	GetInfo(*gin.Context) (*dto.UserGetInfoResp, error)
	UpdateInfo(*gin.Context, *dto.UserUpdateInfoReq) error
	UpdatePwd(*gin.Context, *dto.UserUpdatePasswordReq) error
}

var _ IUserController = (*UserController)(nil)

type UserController struct {
	// maybe some logic config to read from viper
	// or a service dependency
}

func NewUserController() *UserController {
	return &UserController{}
}

func (c *UserController) Register(ctx *gin.Context, req *dto.UserRegisterReq) error {
	tx := dao.DB(ctx)

	user := model.User{
		Email:    req.Email,
		Password: HashWithSHA256(req.Password),
		Name:     req.Name,
	}
	// check email format
	pattern := `\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*` //匹配电子邮箱
	reg := regexp.MustCompile(pattern)
	if !reg.MatchString(user.Email) {
		return stacktrace.NewError("Email format is wrong.")
	}
	err := tx.Create(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return stacktrace.PropagateWithCode(err, dto.ErrEmailExist, "Email already exists.")
		}
		return err
	}

	return nil
}

func (c *UserController) Login(ctx *gin.Context, req *dto.UserLoginReq) error {
	user := model.User{
		Email: req.Email,
	}
	// 1. check if user exists
	err := dao.DB(ctx).Where(&user).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return stacktrace.PropagateWithCode(err, dto.ErrUserNotFound, "User not found.")
		}
		return err
	}
	// 2. check if password is correct
	if user.Password != HashWithSHA256(req.Password) {
		return stacktrace.NewErrorWithCode(dto.ErrPassword, "Wrong password.")
	}
	// 3. generate token
	tokenString, err := generateToken(user.ID)
	if err != nil {
		return err
	}
	// 4. set token in cookie
	setCookie(ctx, tokenString)
	return nil
}

func (c *UserController) Logout(ctx *gin.Context) error {
	ctx.SetCookie("token", "", -1, "/", "localhost", false, true)
	return nil
}

func (c *UserController) GetInfo(ctx *gin.Context) (*dto.UserGetInfoResp, error) {
	var resp dto.UserGetInfoResp
	var user model.User
	userID := ctx.GetUint("userID")
	err := dao.DB(ctx).First(&user, userID).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.ErrUserNotFound, "User not found.")
	}
	resp = dto.UserGetInfoResp{
		Email: user.Email,
		Name:  user.Name,
		ID:    user.ID,
	}
	return &resp, nil
}

func (c *UserController) UpdateInfo(ctx *gin.Context, req *dto.UserUpdateInfoReq) error {
	user := model.User{
		ID: req.ID,
	}
	// check auth
	userID := ctx.GetUint("userID")
	if user.ID == 0 {
		return stacktrace.NewErrorWithCode(dto.ErrNotLogin, "User not login.")
	}
	if user.ID != userID {
		return stacktrace.NewErrorWithCode(dto.ErrPrivilege, "You don't have the privilege to update this user.")
	}
	//check if user exists
	tx := dao.DB(ctx).Where(&user).First(&user)
	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return stacktrace.PropagateWithCode(tx.Error, dto.ErrUserNotFound, "User not found.")
	}
	user.Name = req.Name
	user.Email = req.Email
	err := dao.DB(ctx).Updates(&user).Error
	//check if email exist
	if err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return stacktrace.PropagateWithCode(err, dto.ErrEmailExist, "Email exists.")
		}
		return err
	}
	return nil
}

func (c *UserController) UpdatePwd(ctx *gin.Context, req *dto.UserUpdatePasswordReq) error {
	var user model.User
	userID := ctx.GetUint("userID")

	if userID == 0 {
		return stacktrace.NewErrorWithCode(dto.ErrNotLogin, "User not login.")
	}

	if req.ID != userID {
		return stacktrace.NewErrorWithCode(dto.ErrPrivilege, "You don't have the privilege to update this user.")
	}

	err := dao.DB(ctx).First(&user, userID).Error
	if err != nil {
		return stacktrace.PropagateWithCode(err, dto.ErrUserNotFound, "User not found.")
	}

	if user.Password != HashWithSHA256(req.OldPassword) {
		return stacktrace.NewErrorWithCode(dto.ErrPassword, "Wrong password.")
	}

	user.Password = HashWithSHA256(req.NewPassword)
	err = dao.DB(ctx).Model(&user).Updates(&user).Error

	if err != nil {
		return err
	}

	return nil
}

func HashWithSHA256(s string) string {
	var hashInstance hash.Hash
	hashInstance = sha256.New()
	hashInstance.Write([]byte(s))
	return fmt.Sprintf("%x", hashInstance.Sum(nil))
}

func setCookie(ctx *gin.Context, tokenString string) {
	if gin.Mode() == gin.TestMode {
		ctx.Request.Header.Set("Cookie", "token="+tokenString)
		return
	}
	ctx.SetCookie("token", tokenString, 3600, "/", "localhost", false, true)
}
