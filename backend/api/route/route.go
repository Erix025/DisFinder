package route

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
	"disfinder-backend/api/dto"
)

func Ping(c *gin.Context) {
	c.JSON(http.StatusOK, dto.Resp{
		Code: http.StatusOK,
		Msg:  "success",
		Data: "pong~",
	})
}

func SetupRouter(e *gin.Engine) {
	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:8000", "http://localhost"},
		AllowCredentials: true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type"},
	}
	e.Use(cors.New(config))
	r := e.Group("/api")
	r.GET("/ping", Ping)
}
