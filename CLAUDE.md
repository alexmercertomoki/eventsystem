# Event System - 项目记忆

## 后端架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                          客户端请求                                    │
│                    (浏览器 / Postman / 前端应用)                        │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Express Server (index.ts)                        │
│                      Port: 3001                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  中间件层 (Middleware)                                        │   │
│  │  • CORS                                                      │   │
│  │  • express.json()                                            │   │
│  │  • express.urlencoded()                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        路由层 (Routes)                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  /api/auth (auth.routes.ts)                                 │   │
│  │  ├─ POST /login          - 管理员登录                         │   │
│  │  └─ GET  /me             - 获取当前用户信息                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  /api/admin/events (event.routes.ts) [需要认证]              │   │
│  │  ├─ POST   /                    - 创建活动                    │   │
│  │  ├─ GET    /                    - 获取活动列表                 │   │
│  │  ├─ GET    /:id                 - 获取单个活动                 │   │
│  │  ├─ PUT    /:id                 - 更新活动                    │   │
│  │  ├─ DELETE /:id                 - 删除活动                    │   │
│  │  └─ PUT    /:id/content-blocks  - 更新活动内容块               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  /api/events (public.routes.ts) [公开访问]                   │   │
│  │  ├─ GET /events          - 获取已发布活动列表                  │   │
│  │  └─ GET /events/:slug    - 获取已发布活动详情                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    认证中间件 (Middleware)                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  auth.middleware.ts                                          │   │
│  │  ├─ authenticate()        - 验证 JWT Token                   │   │
│  │  └─ requireSuperAdmin()   - 验证超级管理员权限                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      服务层 (Services)                               │
│                    [业务逻辑处理]                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  auth.service.ts                                             │   │
│  │  ├─ login()              - 登录逻辑 + JWT 生成                │   │
│  │  ├─ verifyToken()        - 验证 Token                        │   │
│  │  └─ getAdminById()       - 获取管理员信息                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  event.service.ts                                            │   │
│  │  ├─ createEvent()        - 创建活动                           │   │
│  │  ├─ getEvents()          - 获取活动列表                        │   │
│  │  ├─ getEventById()       - 获取活动详情                        │   │
│  │  ├─ updateEvent()        - 更新活动                           │   │
│  │  ├─ deleteEvent()        - 删除活动                           │   │
│  │  └─ updateContentBlocks() - 更新内容块                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      数据验证层 (Validation)                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  validation.ts (使用 Zod)                                    │   │
│  │  ├─ loginSchema                                              │   │
│  │  ├─ createEventSchema                                        │   │
│  │  ├─ updateEventSchema                                        │   │
│  │  └─ contentBlockSchema                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ORM 层 (Prisma)                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  prisma.ts (Prisma Client 实例)                              │   │
│  │                                                              │   │
│  │  提供的方法:                                                   │   │
│  │  • prisma.admin.findUnique()                                 │   │
│  │  • prisma.event.create()                                     │   │
│  │  • prisma.event.findMany()                                   │   │
│  │  • prisma.contentBlock.deleteMany()                          │   │
│  │  • prisma.$transaction()                                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                               │
│                   (Docker Container)                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  数据表:                                                       │   │
│  │  ├─ admins            (管理员表)                              │   │
│  │  ├─ events            (活动表)                                │   │
│  │  └─ content_blocks    (内容块表)                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 文件结构详解

```
packages/server/
├── src/
│   ├── index.ts                    # 🚀 应用入口 - Express 服务器
│   │
│   ├── lib/                        # 📚 核心库
│   │   └── prisma.ts              # Prisma Client 单例
│   │
│   ├── types/                      # 📝 TypeScript 类型定义
│   │   └── index.ts               # AuthRequest, JWTPayload, ApiResponse
│   │
│   ├── middleware/                 # 🛡️ 中间件
│   │   └── auth.middleware.ts     # JWT 认证、权限验证
│   │
│   ├── routes/                     # 🛤️ 路由控制器
│   │   ├── auth.routes.ts         # 认证路由 (/api/auth)
│   │   ├── event.routes.ts        # 管理员活动路由 (/api/admin/events)
│   │   └── public.routes.ts       # 公开路由 (/api/events)
│   │
│   ├── services/                   # 💼 业务逻辑层
│   │   ├── auth.service.ts        # 认证服务
│   │   └── event.service.ts       # 活动服务
│   │
│   └── utils/                      # 🔧 工具函数
│       └── validation.ts          # Zod 验证 Schema
│
├── prisma/
│   ├── schema.prisma              # 📊 数据库 Schema 定义
│   └── seed.ts                    # 🌱 种子数据脚本
│
└── tests/                         # 🧪 测试文件
```

---

## 请求流程示例

### 示例 1: 管理员登录

```
1. POST /api/auth/login
   Body: { email: "admin@eventsystem.com", password: "admin123" }

2. auth.routes.ts 接收请求
   ├─ 使用 loginSchema 验证数据
   └─ 调用 authService.login()

3. auth.service.ts 处理登录
   ├─ 通过 prisma.admin.findUnique() 查找用户
   ├─ 使用 bcrypt.compare() 验证密码
   ├─ 使用 jwt.sign() 生成 Token
   └─ 返回 { token, admin }

4. 返回给客户端
   { success: true, data: { token: "eyJ...", admin: {...} } }
```

### 示例 2: 创建活动（需要认证）

```
1. POST /api/admin/events
   Headers: { Authorization: "Bearer eyJ..." }
   Body: { title: "新活动", slug: "new-event", ... }

2. 经过 authenticate 中间件
   ├─ 提取 Token
   ├─ authService.verifyToken() 验证
   ├─ 查找管理员 prisma.admin.findUnique()
   └─ 将 admin 附加到 req.admin

3. event.routes.ts 接收请求
   ├─ 使用 createEventSchema 验证数据
   └─ 调用 eventService.createEvent()

4. event.service.ts 处理创建
   ├─ 检查 slug 是否重复
   ├─ prisma.event.create() 创建活动
   └─ 返回创建的活动

5. 返回给客户端
   { success: true, data: { id: "...", title: "新活动", ... } }
```

---

## 数据模型关系

```
┌─────────────┐           ┌─────────────┐           ┌──────────────┐
│   Admin     │ 1     ∞   │   Event     │ 1     ∞   │ContentBlock  │
│─────────────│───────────│─────────────│───────────│──────────────│
│ id          │           │ id          │           │ id           │
│ email       │           │ title       │           │ type         │
│ password    │           │ slug        │           │ content      │
│ name        │           │ description │           │ orderIndex   │
│ role        │           │ startTime   │           │ eventId  ────┤
│ isActive    │           │ endTime     │           │ createdBy ───┤
└─────────────┘           │ status      │           └──────────────┘
                          │ createdBy ──┤
                          └─────────────┘

一个 Admin 可以创建多个 Event
一个 Event 可以有多个 ContentBlock
一个 Admin 也可以创建多个 ContentBlock
```

---

## API 端点总结

### 认证 API
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/login | 管理员登录 | ❌ |
| GET | /api/auth/me | 获取当前用户 | ✅ |

### 管理员活动 API
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/admin/events | 创建活动 | ✅ |
| GET | /api/admin/events | 获取活动列表 | ✅ |
| GET | /api/admin/events/:id | 获取活动详情 | ✅ |
| PUT | /api/admin/events/:id | 更新活动 | ✅ |
| DELETE | /api/admin/events/:id | 删除活动 | ✅ |
| PUT | /api/admin/events/:id/content-blocks | 更新内容块 | ✅ |

### 公开 API
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/events | 获取已发布活动 | ❌ |
| GET | /api/events/:slug | 获取活动详情 | ❌ |

---

## 核心技术栈

- **Express.js** - Web 框架
- **Prisma** - ORM (类似 Hibernate)
- **PostgreSQL** - 数据库
- **JWT** - 身份认证
- **Zod** - 数据验证
- **bcryptjs** - 密码加密
- **TypeScript** - 类型安全

---

## 初始管理员账号

```
Email: admin@eventsystem.com
Password: admin123
```

---

## 快速启动命令

```bash
# 启动数据库
docker compose up -d

# 运行迁移
npm run db:migrate --workspace=packages/server

# 创建初始管理员
npm run db:seed --workspace=packages/server

# 启动开发服务器
npm run dev --workspace=packages/server
```

---

## 下一步计划

- [ ] 测试后端 API
- [ ] 创建前端登录页面
- [ ] 创建活动管理页面
- [ ] 实现 Canvas 内容编辑器
