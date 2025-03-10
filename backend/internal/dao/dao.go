package dao

import (
	"context"
	"disfinder-backend/internal/dao/model"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type DBMS struct {
	*gorm.DB
}

var (
	db *gorm.DB
)

var DB = func(ctx context.Context) *DBMS {
	return &DBMS{db.WithContext(ctx)}

}

// >>>>>>>>>>>> init >>>>>>>>>>>>

type DBCfg struct {
	DSN string
}

func InitPlatform() {
	platforms := []model.Platform{
		{1, "Amazon"}, {2, "EBay"},
	}

	for _, platform := range platforms {
		if err := db.FirstOrCreate(&platform, model.Platform{ID: platform.ID}).Error; err != nil {
			logrus.Fatal(err)
		}
	}
}

func InitDB() {
	var cfg DBCfg
	err := viper.Sub("Database").UnmarshalExact(&cfg)
	if err != nil {
		logrus.Fatal(err)
	}

	db, err = gorm.Open(mysql.Open(cfg.DSN), &gorm.Config{TranslateError: true, DisableForeignKeyConstraintWhenMigrating: true})
	if err != nil {
		logrus.Fatal(err)
	}

	// Uncomment this if you want to use auto migrate
	//
	if err := db.AutoMigrate(&model.Wishlist{}, &model.Product{}, &model.User{}, &model.Platform{}, &model.PriceHistory{}); err != nil {
		logrus.Fatal(err)
	}

	InitPlatform()

	if viper.GetString("App.RunLevel") == "debug" {
		db = db.Debug()
	}

}
