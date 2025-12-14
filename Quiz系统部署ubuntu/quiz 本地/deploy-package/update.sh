#!/bin/bash

DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "========== Quiz 项目更新部署 =========="

# 停止旧的后端进程
echo "[1/4] 停止后端服务..."
sudo pkill -f quiz-0.0.1-SNAPSHOT.jar 2>/dev/null
sleep 2

# 部署前端
echo "[2/4] 更新前端文件..."
sudo cp -r "$DEPLOY_DIR/user-frontend/"* /var/www/user-frontend/
sudo cp -r "$DEPLOY_DIR/admin-frontend/"* /var/www/admin-frontend/

# 部署后端
echo "[3/4] 更新后端文件..."
sudo cp "$DEPLOY_DIR/quiz-0.0.1-SNAPSHOT.jar" /opt/quiz/
sudo cp "$DEPLOY_DIR/application.yml" /opt/quiz/

# 启动后端
echo "[4/4] 启动后端服务..."
cd /opt/quiz
nohup java -jar quiz-0.0.1-SNAPSHOT.jar --spring.config.location=file:./application.yml > app.log 2>&1 &

echo "等待后端启动..."
sleep 8

echo ""
echo "========== 后端启动日志 =========="
tail -20 /opt/quiz/app.log

echo ""
echo "========== 部署完成 =========="
echo "用户前端: http://localhost/"
echo "管理员前端: http://localhost/admin/"
echo "管理员账号: admin / admin123"
