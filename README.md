# Quiz后台管理系统

这是一个基于 Vue.js 2.x 和 Element UI 的 Quiz 后台管理系统前端项目。

## 功能特性

- 📊 用户管理：查询、添加、编辑、删除用户
- 📝 题目管理：查询、添加、编辑、删除题目
- 🎨 现代化 UI：使用 Element UI 组件库
- 🚀 路由管理：基于 Vue Router 的多页面管理
- ✨ 交互效果：按钮 hover 效果、弹窗对话框

## 项目结构

```
task7/
├── public/
│   └── index.html          # HTML 模板
├── src/
│   ├── router/
│   │   └── index.js        # 路由配置
│   ├── views/
│   │   ├── UserView.vue    # 用户管理页面
│   │   └── QuestionView.vue # 题目管理页面
│   ├── App.vue             # 主应用组件
│   └── main.js             # 入口文件
├── babel.config.js         # Babel 配置
├── vue.config.js           # Vue CLI 配置
└── package.json            # 项目依赖
```

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 运行开发服务器

```bash
npm run serve
```

项目将在 `http://localhost:8080` 启动。

### 3. 构建生产版本

```bash
npm run build
```

## 页面说明

### 用户管理页面

- **路径**: `/user`
- **功能**:
  - 用户列表展示（日期、用户名、密码）
  - 用户搜索
  - 添加新用户（包含密码确认）
  - 编辑用户
  - 删除用户
  - 分页显示

### 题目管理页面

- **路径**: `/question`
- **功能**:
  - 题目列表展示（序号、问题、选项、答案）
  - 题目搜索
  - 添加新题目（支持 4 个选项）
  - 编辑题目
  - 删除题目
  - 分页显示

## 技术栈

- **Vue.js 2.6.14**: 渐进式 JavaScript 框架
- **Vue Router 3.5.1**: 官方路由管理器
- **Element UI 2.15.13**: 基于 Vue 的组件库
- **Vue CLI 5.0**: 标准工具链

## 界面特性

- 顶部标题栏：Quiz后台管理
- 侧边导航栏：系统信息管理菜单
- 主内容区：动态路由内容展示
- 按钮 hover 效果：轻微上移和阴影
- 响应式表格和表单布局
- 优雅的弹窗对话框

## 注意事项

- 当前使用虚拟数据进行展示
- 删除操作会弹出确认对话框
- 添加用户时会验证两次密码是否一致
- 所有操作都有消息提示反馈

## 开发说明

本项目基于 Element UI 组件库开发，主要使用了以下组件：

- Container 布局容器
- Menu 导航菜单
- Form 表单
- Table 表格
- Pagination 分页
- Dialog 对话框
- Button 按钮
- Message 消息提示

## 浏览器支持

- 现代浏览器（Chrome、Firefox、Safari、Edge）
- IE11+ （需要相应的 polyfills）

