package route

import (
	"disfinder-backend/api/dto"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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
		AllowOrigins:     []string{"http://localhost:3010", "http://localhost"},
		AllowCredentials: true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type"},
	}
	e.Use(cors.New(config))
	r := e.Group("/api")
	r.GET("/ping", Ping)
	setupUserController(r)
	setupProductController(r)
	setupWishlistController(r)
	setupPlatformRoutes(r)
}
