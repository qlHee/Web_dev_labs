#!/bin/bash

echo "========== Quiz 项目部署脚本 =========="

# 1. 安装必要软件
echo "[1/6] 安装必要软件..."
sudo apt update
sudo apt install -y mysql-server nginx openjdk-17-jdk

# 2. 配置 MySQL
echo "[2/6] 配置 MySQL..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';"
sudo mysql -u root -p123456 -e "CREATE USER IF NOT EXISTS 'testme'@'localhost' IDENTIFIED BY '12345';"
sudo mysql -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS quiz;"
sudo mysql -u root -p123456 -e "GRANT ALL PRIVILEGES ON quiz.* TO 'testme'@'localhost';"
sudo mysql -u root -p123456 -e "FLUSH PRIVILEGES;"

# 3. 导入数据库
echo "[3/6] 导入数据库..."
mysql -u testme -p12345 quiz < quiz.sql

# 4. 部署后端
echo "[4/6] 部署后端..."
sudo mkdir -p /opt/quiz
sudo cp quiz-0.0.1-SNAPSHOT.jar /opt/quiz/
sudo cp application.yml /opt/quiz/

# 5. 部署前端
echo "[5/6] 部署前端..."
sudo mkdir -p /var/www/user-frontend
sudo mkdir -p /var/www/admin-frontend
sudo cp -r user-frontend/* /var/www/user-frontend/
sudo cp -r admin-frontend/* /var/www/admin-frontend/

# 6. 配置 Nginx
echo "[6/6] 配置 Nginx..."
sudo cp nginx-quiz.conf /etc/nginx/sites-available/quiz
sudo ln -sf /etc/nginx/sites-available/quiz /etc/nginx/sites-enabled/quiz
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# 启动后端
echo "启动后端服务..."
cd /opt/quiz
sudo pkill -f quiz-0.0.1-SNAPSHOT.jar 2>/dev/null
sleep 2
nohup java -jar quiz-0.0.1-SNAPSHOT.jar --spring.config.location=file:./application.yml > app.log 2>&1 &
sleep 5
echo "等待后端启动..."

echo ""
echo "========== 部署完成 =========="
echo "用户前端: http://localhost/"
echo "管理员前端: http://localhost/admin/"
echo "管理员账号: admin / admin123"
echo ""
echo "查看后端日志: tail -f /opt/quiz/app.log"
