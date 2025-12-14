# Quiz在线测试系统

这是一个基于Spring Boot和Vue.js开发的在线测试系统，包含用户端和管理员端两个前端应用以及Java后端服务。

## 项目结构

```
quiz-project/
├── user-frontend/     # 用户前端（HTML/CSS/JS）
├── admin-frontend/    # 管理员前端（Vue.js）
├── backend/           # 后端服务（Spring Boot）
├── nginx.conf         # Nginx配置文件
├── deployment-guide.md # 部署指南
└── start.sh           # 本地开发启动脚本
```

## 功能特性

### 用户端功能
- 注册账号
- 登录系统
- 参加测试并查看结果

### 管理员端功能
- 管理员登录
- 用户管理（增加/删除/分页显示/重置密码/按关键词查询）
- 题目管理（增加/删除/修改/分页显示/按关键词查询）

### 后端功能
- JWT权限控制
- 区分普通用户和管理员登录
- RESTful API支持

## 技术栈

### 前端
- 用户端: HTML + CSS + JavaScript + Axios
- 管理员端: Vue.js + Element UI + Axios

### 后端
- Spring Boot
- MyBatis
- MySQL
- JWT认证

### 部署环境
- Ubuntu Server (UTM虚拟机)
- MySQL 8.0
- Nginx
- Java 17

## 快速启动（本地开发环境）

### 先决条件
- Java 11+
- Maven 3.6+
- Node.js 14+
- npm 6+
- MySQL 8.0+

### 数据库配置
1. 创建MySQL数据库
```sql
CREATE DATABASE quiz;
```

2. 导入初始数据
```bash
mysql -u root -p quiz < backend/src/main/resources/quiz.sql
```

3. 修改后端配置文件
```
修改 backend/src/main/resources/application.yml 中的数据库连接信息
```

### 启动服务
使用提供的启动脚本启动所有服务：
```bash
chmod +x start.sh
./start.sh
```

或分别启动各个服务：

1. 启动后端服务
```bash
cd backend
mvn spring-boot:run
```

2. 启动管理员前端
```bash
cd admin-frontend
npm install
npm run serve
```

3. 启动用户前端
```bash
cd user-frontend
# 可以使用任意HTTP服务器，例如
python -m http.server 3000
```

## 部署指南

详细的部署步骤请参考 [deployment-guide.md](deployment-guide.md)。

## 默认账户

- 管理员账户：
  - 用户名：admin
  - 密码：admin123

## 许可证

本项目仅用于教育目的。
