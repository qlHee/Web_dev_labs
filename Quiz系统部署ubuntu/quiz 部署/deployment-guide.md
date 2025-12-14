# Quiz前后端部署指南

本文档提供在macOS上使用UTM创建Ubuntu虚拟机并部署Quiz项目的详细步骤。

## 1. 安装UTM

1. 从官网下载并安装UTM: https://mac.getutm.app/
2. 安装完成后启动UTM应用程序

## 2. 创建Ubuntu虚拟机

1. 下载Ubuntu Server 22.04 LTS镜像文件: https://ubuntu.com/download/server
2. 在UTM中点击"创建新虚拟机"
3. 选择"虚拟化"
4. 选择"Linux"
5. 选择刚下载的Ubuntu ISO文件
6. 设置内存至少为2GB，存储至少为20GB
7. 点击"保存"创建虚拟机
8. 启动虚拟机并按照安装向导完成Ubuntu的安装

## 3. Ubuntu基础环境配置

### 3.1 安装必要软件

```bash
# 更新软件包列表
sudo apt update
sudo apt upgrade -y

# 安装MySQL
sudo apt install -y mysql-server

# 安装Nginx
sudo apt install -y nginx

# 安装Java
sudo apt install -y openjdk-17-jdk

# 安装其他工具
sudo apt install -y git unzip curl
```

### 3.2 配置MySQL

```bash
# 登录MySQL
sudo mysql -u root

# 设置root密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';

# 创建应用用户
CREATE USER 'testme' IDENTIFIED BY '12345';

# 刷新权限
FLUSH PRIVILEGES;

# 退出MySQL
exit;
```

## 4. 部署后端

### 4.1 创建数据库和表

```bash
# 导入SQL文件
sudo mysql -u root -p < quiz.sql
```

### 4.2 部署Java应用

```bash
# 创建应用目录
sudo mkdir -p /opt/quiz

# 将JAR文件复制到应用目录
sudo cp quiz-0.0.1-SNAPSHOT.jar /opt/quiz/

# 创建配置文件
sudo nano /opt/quiz/application.yml
```

application.yml内容:

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/quiz?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: testme
    password: 12345

server:
  port: 8080
  address: localhost

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.quiz.entity
  configuration:
    map-underscore-to-camel-case: true

jwt:
  secret: quiz-secret-key-for-jwt-token-generation-and-validation
  expiration: 3600000
```

启动应用:

```bash
# 启动后端应用
cd /opt/quiz
nohup java -jar quiz-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

# 查看日志
tail -f app.log
```

## 5. 部署前端

### 5.1 部署用户前端

```bash
# 创建用户前端目录
sudo mkdir -p /var/www/user-frontend

# 将用户前端文件复制到目录中
sudo cp -r user-frontend/* /var/www/user-frontend/
```

### 5.2 部署管理前端

在本地构建Vue项目:

```bash
# 在macOS上构建Vue项目
cd quiz-project/admin-frontend
npm install
npm run build
```

然后将生成的dist目录中的文件复制到服务器:

```bash
# 在Ubuntu上创建管理前端目录
sudo mkdir -p /var/www/admin-frontend

# 将生成的dist目录内容复制到服务器
sudo cp -r dist/* /var/www/admin-frontend/
```

## 6. 配置Nginx

```bash
# 备份默认配置
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak

# 创建新配置
sudo nano /etc/nginx/sites-available/quiz
```

将以下内容写入配置文件:

```nginx
server {
    listen 80;
    server_name localhost;

    # 用户前端
    location / {
        root /var/www/user-frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 管理员前端
    location /admin/ {
        alias /var/www/admin-frontend/;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    # 后端API代理
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置:

```bash
# 创建链接到sites-enabled目录
sudo ln -s /etc/nginx/sites-available/quiz /etc/nginx/sites-enabled/

# 检查Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## 7. 验证部署

1. 用户前端: http://虚拟机IP地址/
2. 管理员前端: http://虚拟机IP地址/admin/

## 8. 常用命令

```bash
# 查看后端应用状态
ps aux | grep java

# 重启后端应用
kill $(pgrep -f quiz-0.0.1-SNAPSHOT.jar)
cd /opt/quiz
nohup java -jar quiz-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

# 查看Nginx状态
sudo systemctl status nginx

# 重启Nginx
sudo systemctl restart nginx

# 查看日志
tail -f /opt/quiz/app.log
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 9. 常见问题排查

1. 如果前端无法访问后端API:
   - 检查后端应用是否正常运行: `ps aux | grep java`
   - 检查后端日志: `tail -f /opt/quiz/app.log`
   - 检查Nginx配置和日志

2. 如果管理员前端页面显示空白:
   - 检查浏览器控制台报错
   - 检查Nginx配置中的alias路径是否正确

3. 数据库连接问题:
   - 检查MySQL服务状态: `sudo systemctl status mysql`
   - 验证数据库用户权限: `mysql -u testme -p`
   - 检查应用配置文件中的数据库连接信息
