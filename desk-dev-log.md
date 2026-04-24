# Desk App 开发日志

## 项目信息
- **项目名称**: village-helper-desk-app
- **技术栈**: Electron + Vue3 + Element Plus
- **Git 仓库**: https://github.com/kalaqinsongqi/village-helper-desk-app.git

## 开发记录

### 2026-04-22 - 用户登录功能与主页面框架

#### 完成功能
- [x] 项目初始化：Vite + Vue3 + Element Plus + Electron
- [x] 登录页面：简洁美观的渐变背景 + 表单校验
- [x] 登录 API 对接：调用后端 `/api/v1/auth/login`
- [x] JWT Token 存储与请求拦截
- [x] 主页面框架：左侧菜单栏 + 顶部标题栏 + 内容区
- [x] 欢迎页面：展示用户信息 + 快捷入口
- [x] 土地确权菜单占位页面
- [x] 路由守卫：未登录自动跳转登录页
- [x] 退出登录功能
- [x] 土地确权列表页面：搜索条件 + 数据表格 + 分页

#### 土地确权页面功能
- 检索条件：承包方姓名、合同号、是否签字确认（下拉）、承包地块数范围（1-1000）
- 列表字段：序号、合同号、承包方姓名、94年承包合同总面积、承包地块数、确权面积、是否签字、操作
- 操作列：详细按钮（后续扩展详情弹窗）
- 分页：支持每页 10/20/50/100 条

#### 项目结构
```
desk-app/
├── electron/
│   ├── main.js          # Electron 主进程
│   └── preload.js       # 预加载脚本
├── src/
│   ├── main.js          # Vue 入口
│   ├── App.vue          # 根组件
│   ├── api/
│   │   └── auth.js      # 认证相关 API
│   ├── router/
│   │   └── index.js     # Vue Router 配置
│   └── views/
│       ├── LoginView.vue      # 登录页
│       ├── MainView.vue       # 主页面框架
│       ├── WelcomeView.vue    # 欢迎页
│       └── LandRightsView.vue # 土地确权（占位）
├── index.html
├── vite.config.js
├── package.json
└── desk-dev-log.md
```

#### 启动方式

**桌面应用模式（推荐）**
```bash
cd desk-app
npm run electron:dev
```
一键启动：先启动 Vite 开发服务器，等待就绪后自动打开 Electron 桌面窗口。

**Web 模式（仅前端界面调试）**
```bash
cd desk-app
npm run dev
```
浏览器访问 http://localhost:5173

#### 默认账号
- 用户名: `admin`
- 密码: `admin`
