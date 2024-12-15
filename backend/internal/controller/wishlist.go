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
	UserID := c.GetUint("userID")
	if UserID == 0 {
		return nil, stacktrace.NewErrorWithCode(dto.ErrNotLogin, "User is not logged in")
	}
	var pids []uint
	var products []model.Product
	var condition model.Wishlist
	condition.UserID = UserID
	err := dao.DB(c).Model(&model.Wishlist{}).Where(&condition).Pluck("product_id", &pids).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Failed to get wishlist")
	}
	// get products
	tx := dao.DB(c).Model(&model.Product{}).Where("id IN (?)", pids)
	err = tx.Count(&resp.Total).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Failed to get wishlist")
	}
	if resp.Total == 0 {
		return nil, stacktrace.NewErrorWithCode(dto.ErrEmptyWishlist, "Wishlist is empty")
	}
	if resp.Total < int64(req.PageNum*req.PageSize) {
		return nil, stacktrace.NewErrorWithCode(dto.ErrInvalidPage, "Invalid page number")
	}
	err = tx.Offset(req.PageNum * req.PageSize).Limit(req.PageSize).Find(&products).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Failed to get wishlist")
	}
	for _, product := range products {
		resp.Products = append(resp.Products, dto.WishlistGetItem{
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
	UserID := c.GetUint("userID")
	if UserID == 0 {
		return stacktrace.NewErrorWithCode(dto.ErrNotLogin, "User is not logged in")
	}
	// check if the product ID is valid
	var product model.Product
	err := dao.DB(c).Where("id = ?", req.ID).First(&product).Error
	if err != nil {
		return stacktrace.PropagateWithCode(err, dto.ErrProductNotFound, "Product not found")
	}
	// get product ID
	ProductID := req.ID
	wishlist := model.Wishlist{
		UserID:    UserID,
		ProductID: ProductID,
	}
	// check if the product is already in the wishlist
	err = dao.DB(c).Where(&wishlist).First(&wishlist).Error
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
	UserID := c.GetUint("userID")
	if UserID == 0 {
		return stacktrace.NewErrorWithCode(dto.ErrNotLogin, "User is not logged in")
	}
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
	UserID := c.GetUint("userID")
	if UserID == 0 {
		return stacktrace.NewErrorWithCode(dto.ErrNotLogin, "User is not logged in")
	}
	// delete all products from wishlist
	err := dao.DB(c).Where("user_id = ?", UserID).Delete(&model.Wishlist{}).Error
	if err != nil {
		return stacktrace.PropagateWithCode(err, dto.InternalError, "Failed to clear wishlist")
	}
	return nil
}
