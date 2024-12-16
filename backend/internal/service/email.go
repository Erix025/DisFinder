package service

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"net/smtp"
	"strings"
)

type EmailCfg struct {
	Host     string
	Port     int
	User     string
	Password string
}

func sendEmail(to, emailContent string) error {
	var cfg EmailCfg
	err := viper.Sub("Email").UnmarshalExact(&cfg)
	if err != nil {
		logrus.Fatal(err)
	}

	from := cfg.User
	password := cfg.Password
	smtpHost := cfg.Host
	smtpPort := fmt.Sprintf("%d", cfg.Port)
	// auth
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// send email
	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(emailContent))
	if err != nil {
		return err
	}

	return nil
}

func createEmailContent(notices []DiscountNoticeItem) string {
	// create Subject
	subject := "Subject: 商品降价通知\n"

	// create Body
	var bodyBuilder strings.Builder
	bodyBuilder.WriteString("亲爱的用户，\n\n")
	bodyBuilder.WriteString("以下是您关注的商品降价信息：\n\n")
	bodyBuilder.WriteString("商品名称\t\t原价\t\t降价后价\t降幅\n")

	// generate email content
	for _, p := range notices {
		discount := p.OldPrice - p.NewPrice
		discountPercentage := (discount / p.OldPrice) * 100
		bodyBuilder.WriteString(fmt.Sprintf("%s\t%.2f\t%.2f\t%.2f%%\n", p.Name, p.OldPrice, p.NewPrice, discountPercentage))
	}

	bodyBuilder.WriteString("\n祝您购物愉快！\n")

	// return email content
	return subject + "\n" + bodyBuilder.String()
}
