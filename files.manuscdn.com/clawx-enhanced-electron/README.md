# ClawX Enhanced — OpenCode Integration

> 集成 OpenCode 监控的增强版 ClawX 桌面应用

## 项目概述

ClawX Enhanced 是基于 [ClawX](https://github.com/ValueCell-ai/ClawX) 项目的改进版本，核心改进包括：

1. **OpenClaw 基础环境集成** — 安装包包含完整的 OpenClaw Gateway 运行时
2. **主进程与 OpenCode 连接** — Electron 主进程监控本地 OpenCode 会话
3. **双进程隔离 UI** — 侧边栏集成 OpenCode 界面，与 OpenClaw 进程完全隔离

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Main Process                 │
│  ┌─────────────────┐    IPC Bridge    ┌───────────────┐ │
│  │  OpenClaw Gateway│◄──────────────►│  OpenCode      │ │
│  │  (子进程)        │                 │  (子进程)      │ │
│  │  - AI Agent      │                 │  - AI Coding   │ │
│  │  - Skills        │                 │  - Sessions    │ │
│  │  - Channels      │                 │  - LSP         │ │
│  └─────────────────┘                  └───────────────┘ │
│           │                                    │         │
│           └────────────┬───────────────────────┘         │
│                        │                                 │
│              ┌─────────▼─────────┐                       │
│              │  Renderer Process  │                       │
│              │  (React UI)        │                       │
│              │  - OpenClaw Panel  │                       │
│              │  - OpenCode Panel  │                       │
│              │  - Architecture    │                       │
│              │  - Settings        │                       │
│              └───────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Electron 40+ |
| 前端 | React 19 + TypeScript |
| 样式 | Tailwind CSS 4 + shadcn/ui |
| 状态 | Zustand |
| 动画 | Framer Motion |
| 构建 | Vite + electron-builder |
| AI Gateway | OpenClaw v0.2.0-beta.4 |
| AI Coding | OpenCode v1.2.24 |

## 核心特性

### 1. 双进程隔离
OpenClaw Gateway 和 OpenCode 作为独立子进程运行，通过 IPC Bridge 通信。一个进程崩溃不会影响另一个。

### 2. OpenCode 侧边栏
从任何面板都可以展开右侧 OpenCode 终端，快速执行命令、安装插件或修复问题。

### 3. 互助修复
当 OpenClaw 出问题时，可以通过 OpenCode 终端诊断和修复；反之亦然。

### 4. 进程监控
实时显示两个进程的 CPU、内存、运行时间等指标，以及完整的日志流。

## 开发环境搭建

### 前置要求
- Node.js 22+
- pnpm 10+
- Go 1.23+ (用于 OpenCode)
- Python 3.11+ (用于 OpenClaw)

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-org/clawx-enhanced.git
cd clawx-enhanced

# 安装 Node.js 依赖
pnpm install

# 安装 OpenClaw
pip install openclaw

# 安装 OpenCode
go install github.com/anomalyco/opencode@latest
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 启动 Electron 开发模式
pnpm electron:dev
```

### 构建

```bash
# 构建 Windows exe
pnpm build:win

# 构建 macOS
pnpm build:mac

# 构建 Linux
pnpm build:linux
```

## 项目结构

```
clawx-enhanced/
├── electron/                  # Electron 主进程
│   ├── main.ts               # 主进程入口
│   ├── preload.ts            # 预加载脚本
│   ├── services/
│   │   ├── openclawManager.ts # OpenClaw 进程管理
│   │   ├── opencodeManager.ts # OpenCode 进程管理
│   │   └── ipcBridge.ts      # IPC 通信桥接
│   └── utils/
│       └── logger.ts         # 日志工具
├── src/                       # React 渲染进程
│   ├── components/           # UI 组件
│   │   ├── Sidebar.tsx       # 左侧导航
│   │   ├── OpenClawPanel.tsx # OpenClaw 管理面板
│   │   ├── OpenCodePanel.tsx # OpenCode 管理面板
│   │   ├── OpenCodeSidebar.tsx # OpenCode 快速终端
│   │   ├── ArchitecturePanel.tsx # 架构展示
│   │   ├── SettingsPanel.tsx # 设置面板
│   │   ├── StatusBar.tsx     # 底部状态栏
│   │   ├── LogViewer.tsx     # 日志查看器
│   │   └── ProcessIndicator.tsx # 进程状态指示器
│   ├── stores/
│   │   └── processStore.ts   # Zustand 状态管理
│   ├── pages/
│   │   └── Dashboard.tsx     # 主仪表板页面
│   └── App.tsx               # 应用入口
├── resources/                 # 应用资源
│   └── icon.png              # 应用图标
├── package.json
├── electron-builder.yml       # 打包配置
├── vite.config.ts            # Vite 配置
└── tsconfig.json
```

## 配置文件

### OpenClaw 配置 (~/.openclaw/config.yaml)

```yaml
gateway:
  port: 8766
  ws_port: 8765

providers:
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
  openai:
    api_key: ${OPENAI_API_KEY}

skills:
  - document
  - search
  - self-improving
```

### OpenCode 配置 (~/.opencode.json)

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4",
  "server": {
    "port": 9090,
    "host": "localhost"
  }
}
```

## 许可证

MIT License

## 致谢

- [ClawX](https://github.com/ValueCell-ai/ClawX) — 原始项目
- [OpenClaw](https://github.com/AgentrDev/OpenClaw) — AI Agent Gateway
- [OpenCode](https://github.com/anomalyco/opencode) — AI Coding Agent
