package controller

import (
	"disfinder-backend/api/dto"
	"disfinder-backend/internal/dao"
	"disfinder-backend/internal/dao/model"
	"disfinder-backend/utils/stacktrace"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gopkg.in/guregu/null.v4"
)

type IProductController interface {
	GetInfo(*gin.Context, *dto.ProductGetInfoReq) (*dto.ProductGetInfoResp, error)
	Search(*gin.Context, *dto.ProductSearchReq) error
	GetList(*gin.Context, *dto.ProductGetListReq) (*dto.ProductGetListResp, error)
	GetHistory(*gin.Context, *dto.ProductGetHistoryReq) (*dto.ProductGetHistoryResp, error)
}

var _ IProductController = (*ProductController)(nil)

type ProductController struct {
}

func NewProductController() *ProductController {
	return &ProductController{}
}

func (p *ProductController) GetInfo(c *gin.Context, req *dto.ProductGetInfoReq) (*dto.ProductGetInfoResp, error) {
	var resp dto.ProductGetInfoResp
	info := model.Product{
		ID: req.ID,
	}
	err := dao.DB(c).Where(&info).First(&info).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.ErrProductNotFound, "Product not found")
	}
	resp.ID = info.ID
	resp.Name = info.Name
	resp.Picture = info.Picture
	resp.URL = info.URL
	resp.PlatformID = info.PlatformID
	return &resp, nil
}

func SearchEngine(keyword string) ([]dto.SearchItem, error) {
	var rawResp dto.SearchResp
	// send http request to search engine
	url := "http://localhost:8888/spider/search?keyword=" + keyword
	httpResp, err := http.Get(url)
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}
	defer httpResp.Body.Close()
	// parse response
	// print raw response
	// Read the raw response body
	//rawBody, err := io.ReadAll(httpResp.Body)
	//if err != nil {
	//	return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Failed to read response body")
	//}

	//// Print raw response
	//logrus.Debug(string(rawBody))
	err = json.NewDecoder(httpResp.Body).Decode(&rawResp)
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}

	return rawResp.Data, nil
}

func (p *ProductController) Search(c *gin.Context, req *dto.ProductSearchReq) error {
	// search from search engine
	searchResult, err := SearchEngine(req.Keyword)
	if err != nil {
		return err
	}
	// add to database
	for _, item := range searchResult {
		newProduct := model.Product{
			Name:       item.Title,
			Picture:    item.Image,
			URL:        item.URL,
			PlatformID: item.PlatformID,
		}
		err := dao.DB(c).Create(&newProduct).Error
		if err != nil {
			newProduct.URL = ""
			newProduct.Picture = ""
			err = dao.DB(c).Where(&newProduct).First(&newProduct).Error
			if err != nil {
				continue
			}
		}
		newPriceHistory := model.PriceHistory{
			ProductID: newProduct.ID,
			Date:      null.NewTime(time.Now(), true),
			Price:     item.Price,
		}
		err = dao.DB(c).Create(&newPriceHistory).Error
		if err != nil {
			continue
		}
	}
	return nil
}

func (p *ProductController) GetList(c *gin.Context, req *dto.ProductGetListReq) (*dto.ProductGetListResp, error) {
	var resp dto.ProductGetListResp
	var products []model.Product
	keywords := strings.Split(req.Keyword, "+")
	tx := dao.DB(c).Model(&model.Product{})
	for _, keyword := range keywords {
		tx = tx.Where("name LIKE ?", "%"+keyword+"%")
	}
	err := tx.Count(&resp.Total).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Database error")
	}
	if resp.Total < int64(req.PageNum*req.PageSize) {
		return nil, stacktrace.NewErrorWithCode(dto.ErrInvalidPage, "Invalid page number")
	}
	err = tx.Offset(int(req.PageNum * req.PageSize)).Limit(int(req.PageSize)).Find(&products).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Database error")
	}

	// get current price
	for _, item := range products {
		var history model.PriceHistory
		err := dao.DB(c).Model(&model.PriceHistory{}).Where("product_id = ?", item.ID).Order("date desc").First(&history).Error
		if err != nil {
			return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Database error")
		}
		resp.Products = append(resp.Products, dto.ProductInfo{
			ID:         item.ID,
			Name:       item.Name,
			Picture:    item.Picture,
			URL:        item.URL,
			PlatformID: item.PlatformID,
			Price:      history.Price,
		})
	}
	return &resp, nil
}

func (p *ProductController) GetHistory(c *gin.Context, req *dto.ProductGetHistoryReq) (*dto.ProductGetHistoryResp, error) {
	var resp dto.ProductGetHistoryResp
	var history []model.PriceHistory
	// query validation
	if req.StartDate.Time.After(req.EndDate.Time) {
		return nil, stacktrace.NewErrorWithCode(dto.ErrInvalidRequest, "Invalid date range")
	}

	err := dao.DB(c).Where("product_id = ? AND date >= ? AND date <= ?", req.ProductId, req.StartDate, req.EndDate).Find(&history).Error
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.ErrProductNotFound, "Product not found")
	}
	for _, h := range history {
		resp.History = append(resp.History, dto.ProductHistoryItem{
			ProductID: h.ProductID,
			Date:      h.Date,
			Price:     h.Price,
		})
	}
	return &resp, nil
}
