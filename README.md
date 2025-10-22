# 活动平台系统 (Event System)

基于 TDD 开发的活动发布与管理平台 MVP v1.0

## 技术栈

### 前端
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand

### 后端
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT 认证
- Zod 验证

### 开发工具
- Jest (单元测试)
- Supertest (API测试)
- Playwright (E2E测试)
- Docker & Docker Compose

## 环境要求

- Node.js >= 18
- Docker Desktop
- npm >= 8

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动数据库服务

```bash
docker compose up -d
```

验证服务状态：
```bash
docker compose ps
```

### 3. 配置环境变量

```bash
cp .env.example packages/server/.env
```

根据需要修改 `packages/server/.env` 中的配置。

### 4. 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate --workspace=packages/server

# 运行数据库迁移
npm run db:migrate --workspace=packages/server

# 创建初始管理员账户
npm run db:seed --workspace=packages/server
```

### 5. 启动开发服务器

```bash
# 启动后端服务
npm run dev --workspace=packages/server

# 启动前端服务（新终端）
npm run dev --workspace=packages/web
```

## 项目结构

```
eventsystem/
├── packages/
│   ├── web/              # Next.js 前端应用
│   └── server/           # Express 后端服务
│       ├── src/          # 源代码
│       ├── prisma/       # 数据库 schema 和迁移
│       └── tests/        # 测试文件
├── docker-compose.yml    # Docker 服务配置
└── package.json          # 根 package.json (workspaces)
```

## 可用命令

### 根目录

```bash
npm run dev           # 启动后端开发服务器
npm run build         # 构建后端
npm run test          # 运行后端测试
npm run db:migrate    # 运行数据库迁移
npm run db:seed       # 填充种子数据
npm run db:studio     # 打开 Prisma Studio
```

### 数据库管理

```bash
# 启动数据库
docker compose up -d

# 停止数据库
docker compose down

# 查看日志
docker compose logs -f

# 重置数据库（谨慎使用）
docker compose down -v
```

## 开发流程

1. 创建功能分支
2. 编写测试（TDD）
3. 实现功能
4. 运行测试确保通过
5. 提交代码
6. 创建 Pull Request

## MVP v1.0 功能范围

### 已实现
- ✅ 项目初始化和配置
- ✅ Docker 开发环境

### 待实现
- [ ] 管理员认证系统
- [ ] 活动 CRUD 功能
- [ ] Canvas 内容编辑器
- [ ] 活动列表和详情页

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DATABASE_URL | PostgreSQL 连接字符串 | postgresql://dev:dev123@localhost:5432/events_dev |
| JWT_SECRET | JWT 签名密钥 | - |
| PORT | 后端服务端口 | 3001 |
| CORS_ORIGIN | 允许的前端域名 | http://localhost:3000 |
| ALLOWED_IMAGE_DOMAINS | 允许的图片域名 | - |

## 故障排查

### 数据库连接失败
```bash
# 检查 Docker 服务是否运行
docker compose ps

# 重启数据库服务
docker compose restart postgres
```

### 端口冲突
如果端口 5432 或 6379 被占用，可以修改 `docker-compose.yml` 中的端口映射。

## 许可证

MIT
