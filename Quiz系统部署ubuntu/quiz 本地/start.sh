#!/bin/bash

# 启动用户前端开发服务器
start_user_frontend() {
    echo "启动用户前端服务..."
    cd user-frontend
    python3 -m http.server 3000 &
    echo "用户前端已启动，访问地址: http://localhost:3000"
    cd ..
}

# 启动管理员前端开发服务器
start_admin_frontend() {
    echo "启动管理员前端服务..."
    cd admin-frontend
    npm install
    npm run serve &
    echo "管理员前端已启动，访问地址: http://localhost:8081"
    cd ..
}

# 启动后端服务
start_backend() {
    echo "启动后端服务..."
    cd backend
    mvn spring-boot:run &
    echo "后端服务已启动，API地址: http://localhost:8080"
    cd ..
}

# 主函数
main() {
    echo "Quiz项目启动脚本"
    echo "===================="
    
    # 启动所有服务
    start_backend
    sleep 3
    start_admin_frontend
    sleep 3
    start_user_frontend
    
    echo "===================="
    echo "所有服务已启动！"
    echo "用户前端: http://localhost:3000"
    echo "管理员前端: http://localhost:8081"
    echo "后端API: http://localhost:8080"
}

# 执行主函数
main
