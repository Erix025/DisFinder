# 使用 Go 官方镜像
FROM golang:1.23-alpine

WORKDIR /app

# 将 Go 源码复制到容器
COPY . .

# 安装依赖并编译 Go 后端
RUN go mod tidy && go build -o main .

# 暴露 Go 后端服务端口
EXPOSE 8080

CMD ["./main"]