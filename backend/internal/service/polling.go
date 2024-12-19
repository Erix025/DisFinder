package service

import (
	"bytes"
	"disfinder-backend/api/dto"
	"disfinder-backend/internal/dao"
	"disfinder-backend/internal/dao/model"
	"disfinder-backend/utils/stacktrace"
	"encoding/json"
	"net/http"
	"time"

	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"gopkg.in/guregu/null.v4"
)

type DiscountNoticeItem struct {
	ProductID uint
	Name      string
	OldPrice  float64
	NewPrice  float64
}

func Notify(notices map[uint][]DiscountNoticeItem) {
	// send email to user
	for userID, items := range notices {
		var user model.User
		err := dao.DB(nil).Where("id = ?", userID).First(&user).Error
		if err != nil {
			logrus.Error("Notify: ", err)
			continue
		}
		// send email
		content := createEmailContent(items)
		err = sendEmail(user.Email, content)
		if err != nil {
			logrus.Error("Notify: ", err)
		}
		// log
		logrus.Info("Notify: ", user.Email, content)
	}
}

func PollingEngine(url string) (float64, error) {
	var rawResp dto.PollingResp
	req := dto.PollingReq{
		URL: url,
	}
	// send http request to search engine
	reqUrl := "http://localhost:8888/spider/poll"
	jsonReq, err := json.Marshal(req)
	if err != nil {
		return 0, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}
	httpResp, err := http.Post(reqUrl, "application/json", bytes.NewReader(jsonReq))
	if err != nil {
		return 0, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}
	defer httpResp.Body.Close()

	err = json.NewDecoder(httpResp.Body).Decode(&rawResp)
	if err != nil {
		return 0, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}

	return rawResp.Data, nil
}

func Polling() {
	logrus.Info("Polling")
	// do polling
	// get all products in users' wishlist
	var wishlists []model.Wishlist
	notices := make(map[uint][]DiscountNoticeItem)
	err := dao.DB(nil).Find(&wishlists).Error
	if err != nil {
		logrus.Error("Polling: ", err)
	}
	for _, wishlist := range wishlists {
		// get product info
		var product model.Product
		err := dao.DB(nil).Where("id = ?", wishlist.ProductID).First(&product).Error
		if err != nil {
			logrus.Error("Polling: ", err)
			continue
		}
		// get product price
		price, err := PollingEngine(product.URL)
		if err != nil {
			logrus.Error("Polling: ", err)
			continue
		}
		// get product latest price
		var history model.PriceHistory
		err = dao.DB(nil).Where("product_id = ?", product.ID).Order("date desc").First(&history).Error
		if err != nil {
			logrus.Error("Polling: ", err)
			continue
		}
		// compare price
		if price < history.Price {
			if _, ok := notices[wishlist.UserID]; !ok {
				notices[wishlist.UserID] = []DiscountNoticeItem{}
			}
			notices[wishlist.UserID] = append(notices[wishlist.UserID], DiscountNoticeItem{
				ProductID: product.ID,
				Name:      product.Name,
				OldPrice:  history.Price,
				NewPrice:  price,
			})
		}
		// update price history
		newHistory := model.PriceHistory{
			ProductID: wishlist.ProductID,
			Price:     price,
			Date:      null.NewTime(time.Now(), true),
		}
		err = dao.DB(nil).Save(&newHistory).Error
		if err != nil {
			logrus.Error("Polling: ", err)
			continue
		}
	}
	// notify user
	Notify(notices)
}

func InitPolling(interval time.Duration) {
	ticker := time.NewTicker(interval)

	go func() {
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				Polling()
			}
		}
	}()
}

type Cfg struct {
	PollingInterval int // in hours
}

func InitService() {
	var cfg Cfg
	err := viper.Sub("Service").UnmarshalExact(&cfg)
	if err != nil {
		logrus.Fatal(err)
	}
	InitPolling(time.Duration(cfg.PollingInterval) * time.Hour)
}
