# 设置基础镜像
FROM nginx:alpine

# 维护人信息
MAINTAINER vinci "vincijoy96@gmail.com"

# 将dist文件中的内容复制到 /usr/share/nginx/html 这个目录下面
COPY /dist  /usr/share/nginx/html/
