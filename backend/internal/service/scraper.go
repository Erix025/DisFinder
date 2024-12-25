package service

import (
	"bytes"
	"disfinder-backend/api/dto"
	"disfinder-backend/utils/stacktrace"
	"encoding/json"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"net/http"
)

type Scraper struct {
	host string
	port int
}

var (
	scraper *Scraper
)

func GetScraper() *Scraper {
	return scraper
}

type ScraperConfig struct {
	Host string
}

func newScraper(host string) *Scraper {
	return &Scraper{
		host: host,
	}
}

func InitScraper() {
	var cfg ScraperConfig
	err := viper.Sub("Scraper").Unmarshal(&cfg)
	if err != nil {
		logrus.Fatal(err)
	}

	scraper = newScraper(cfg.Host)
}

func (s *Scraper) GetHost() string {
	return s.host
}

func (s *Scraper) Search(keyword string) (*dto.SearchResp, error) {
	var rawResp dto.SearchResp
	// send http request to search engine
	url := s.GetHost() + "/scraper/search?keyword=" + keyword
	httpResp, err := http.Get(url)
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}
	defer httpResp.Body.Close()
	err = json.NewDecoder(httpResp.Body).Decode(&rawResp)
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}
	return &rawResp, nil
}

func (s *Scraper) Poll(req dto.PollingReq) (*dto.PollingResp, error) {
	var rawResp dto.PollingResp
	// send http request to search engine
	url := s.GetHost() + "/scraper/polling"
	jsonReq, err := json.Marshal(req)
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}
	httpResp, err := http.Post(url, "application/json", bytes.NewReader(jsonReq))
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}
	defer httpResp.Body.Close()
	err = json.NewDecoder(httpResp.Body).Decode(&rawResp)
	if err != nil {
		return nil, stacktrace.PropagateWithCode(err, dto.InternalError, "Search engine error")
	}
	return &rawResp, nil
}
