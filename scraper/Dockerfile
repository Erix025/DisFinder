# 使用 Python 官方镜像
FROM python:3.13-alpine

WORKDIR /app

# 复制并安装爬虫的依赖
COPY . .
RUN pip install -r requirements.txt

EXPOSE 8888

# 启动爬虫
CMD ["python", "server.py"]