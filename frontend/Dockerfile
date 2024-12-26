# 使用 Node.js 官方镜像
FROM node:20.17.0-alpine

WORKDIR /app

# 复制并安装前端依赖
COPY . .
RUN npm install

# 构建 Next.js 前端
RUN npm run build

# 暴露端口
EXPOSE 3000

CMD ["npm", "start"]
