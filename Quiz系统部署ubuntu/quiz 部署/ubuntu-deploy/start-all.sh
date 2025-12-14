#!/bin/bash

# ========================================
# Quiz 项目 Ubuntu 一键部署脚本
# 使用方法: chmod +x start-all.sh && ./start-all.sh
# ========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "========================================"
echo "   Quiz 项目 Ubuntu 一键部署脚本"
echo "========================================"
echo ""

# 检测是否需要安装环境
check_and_install() {
    echo "[1/7] 检查并安装必要软件..."
    
    # 更新软件源
    sudo apt update -y
    
    # 安装 MySQL
    if ! command -v mysql &> /dev/null; then
        echo "  -> 安装 MySQL..."
        sudo apt install -y mysql-server
        sudo systemctl start mysql
        sudo systemctl enable mysql
    else
        echo "  -> MySQL 已安装"
        sudo systemctl start mysql 2>/dev/null || true
    fi
    
    # 安装 Nginx
    if ! command -v nginx &> /dev/null; then
        echo "  -> 安装 Nginx..."
        sudo apt install -y nginx
    else
        echo "  -> Nginx 已安装"
    fi
    
    # 安装 Java 17
    if ! command -v java &> /dev/null; then
        echo "  -> 安装 Java 17..."
        sudo apt install -y openjdk-17-jdk
    else
        echo "  -> Java 已安装"
    fi
    
    echo "  -> 软件安装完成"
}

# 配置 MySQL 数据库
setup_database() {
    echo ""
    echo "[2/7] 配置 MySQL 数据库..."
    
    # 尝试配置 MySQL root 用户密码
    sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';" 2>/dev/null || true
    
    # 创建数据库用户
    mysql -u root -p123456 -e "CREATE USER IF NOT EXISTS 'testme'@'localhost' IDENTIFIED BY '12345';" 2>/dev/null || true
    mysql -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS quiz DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
    mysql -u root -p123456 -e "GRANT ALL PRIVILEGES ON quiz.* TO 'testme'@'localhost';" 2>/dev/null || true
    mysql -u root -p123456 -e "FLUSH PRIVILEGES;" 2>/dev/null || true
    
    echo "  -> 数据库用户配置完成"
}

# 导入数据库
import_database() {
    echo ""
    echo "[3/7] 导入数据库..."
    
    # 检查是否已有数据
    TABLE_COUNT=$(mysql -u testme -p12345 -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'quiz';" 2>/dev/null || echo "0")
    
    if [ "$TABLE_COUNT" -eq "0" ] || [ "$TABLE_COUNT" = "0" ]; then
        mysql -u testme -p12345 quiz < "$SCRIPT_DIR/quiz.sql"
        echo "  -> 数据库导入完成"
    else
        echo "  -> 数据库已存在数据，跳过导入"
    fi
}

# 部署后端
deploy_backend() {
    echo ""
    echo "[4/7] 部署后端..."
    
    sudo mkdir -p /opt/quiz
    sudo cp "$SCRIPT_DIR/quiz-0.0.1-SNAPSHOT.jar" /opt/quiz/
    sudo cp "$SCRIPT_DIR/application.yml" /opt/quiz/
    sudo chown -R $USER:$USER /opt/quiz
    
    echo "  -> 后端文件部署完成"
}

# 部署前端
deploy_frontend() {
    echo ""
    echo "[5/7] 部署前端..."
    
    # 用户前端
    sudo mkdir -p /var/www/user-frontend
    sudo cp -r "$SCRIPT_DIR/user-frontend/"* /var/www/user-frontend/
    
    # 管理员前端
    sudo mkdir -p /var/www/admin-frontend
    sudo cp -r "$SCRIPT_DIR/admin-frontend/"* /var/www/admin-frontend/
    
    # 设置权限
    sudo chown -R www-data:www-data /var/www/user-frontend
    sudo chown -R www-data:www-data /var/www/admin-frontend
    sudo chmod -R 755 /var/www/user-frontend
    sudo chmod -R 755 /var/www/admin-frontend
    
    echo "  -> 前端文件部署完成"
}

# 配置 Nginx
setup_nginx() {
    echo ""
    echo "[6/7] 配置 Nginx..."
    
    sudo cp "$SCRIPT_DIR/nginx-quiz.conf" /etc/nginx/sites-available/quiz
    sudo ln -sf /etc/nginx/sites-available/quiz /etc/nginx/sites-enabled/quiz
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # 测试配置
    sudo nginx -t
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo "  -> Nginx 配置完成"
}

# 启动后端服务
start_backend() {
    echo ""
    echo "[7/7] 启动后端服务..."
    
    # 停止已有的后端进程
    pkill -f "quiz-0.0.1-SNAPSHOT.jar" 2>/dev/null || true
    sleep 2
    
    # 启动后端
    cd /opt/quiz
    nohup java -jar quiz-0.0.1-SNAPSHOT.jar --spring.config.location=file:./application.yml > /opt/quiz/app.log 2>&1 &
    
    echo "  -> 等待后端启动..."
    sleep 8
    
    # 检查后端是否启动成功
    if curl -s http://127.0.0.1:8080 > /dev/null 2>&1 || [ -f /opt/quiz/app.log ]; then
        echo "  -> 后端服务启动成功"
    else
        echo "  -> 后端可能还在启动中，请稍等..."
    fi
}

# 显示完成信息
show_complete_info() {
    echo ""
    echo "========================================"
    echo "        部署完成！"
    echo "========================================"
    echo ""
    echo "访问地址："
    echo "  用户前端:   http://localhost/"
    echo "  管理员前端: http://localhost/admin/"
    echo ""
    echo "管理员账号："
    echo "  用户名: admin"
    echo "  密码:   admin123"
    echo ""
    echo "常用命令："
    echo "  查看后端日志: tail -f /opt/quiz/app.log"
    echo "  重启后端:     cd /opt/quiz && pkill -f quiz && nohup java -jar quiz-0.0.1-SNAPSHOT.jar --spring.config.location=file:./application.yml > app.log 2>&1 &"
    echo "  重启Nginx:    sudo systemctl restart nginx"
    echo ""
    echo "========================================"
}

# 主流程
main() {
    check_and_install
    setup_database
    import_database
    deploy_backend
    deploy_frontend
    setup_nginx
    start_backend
    show_complete_info
}

main
