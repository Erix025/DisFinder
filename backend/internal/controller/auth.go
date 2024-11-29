package controller

import (
	"disfinder-backend/api/dto"
	"disfinder-backend/utils/stacktrace"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/spf13/viper"
	"time"
)

var secretKey []byte
var Duration = time.Hour * 7

type secretCfg struct {
	Secret string
}

func InitSecret() {
	var cfg secretCfg
	if err := viper.Sub("Auth").UnmarshalExact(&cfg); err != nil {
		panic(err)
	}
	secretKey = []byte(cfg.Secret)
}

type AuthClaims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

func OptionalAuthMidWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		//check if token exist
		_, err := c.Cookie("token")
		if err != nil {
			c.Next()
			return
		}
		// go to auth middleware
		AuthMidWare()(c)
	}
}

func AuthMidWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		//get token
		tokenString, err := c.Cookie("token")
		if err != nil {
			dto.ResponseFail(c, stacktrace.NewErrorWithCode(dto.ErrPrivilege, "User not login."))
			c.Abort()
			return
		}
		//verify token
		claims, err := parseToken(tokenString)
		if err != nil {
			dto.ResponseFail(c, err)
			c.Abort()
			return
		}
		//set userID in context
		c.Set("userID", claims.UserID)
		c.Next()

	}
}

func parseToken(tokenString string) (*AuthClaims, error) {
	claims := new(AuthClaims)
	//parse token
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
	if err != nil {
		return nil, err
	}
	//check validity of token
	if claims, ok := token.Claims.(*AuthClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, err
}

func generateToken(userID uint) (string, error) {
	claims := AuthClaims{
		userID,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(Duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
