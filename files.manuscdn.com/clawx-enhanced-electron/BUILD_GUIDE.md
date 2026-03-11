# ClawX Enhanced — 构建指南

## 在 Windows 上构建 EXE 安装包

### 前置要求

1. **Node.js 22+**: [下载地址](https://nodejs.org/)
2. **pnpm**: 安装后运行 `npm install -g pnpm`
3. **Go 1.23+**: [下载地址](https://go.dev/dl/) (用于 OpenCode)
4. **Python 3.11+**: [下载地址](https://python.org/) (用于 OpenClaw)
5. **Git**: [下载地址](https://git-scm.com/)

### 构建步骤

```powershell
# 1. 克隆或解压源码
cd C:\Projects
git clone <repo-url> clawx-enhanced
cd clawx-enhanced

# 2. 安装 Node.js 依赖
pnpm install

# 3. 安装 OpenClaw 和 OpenCode
pip install openclaw
go install github.com/anomalyco/opencode@latest

# 4. 构建 Windows EXE
pnpm build:win

# 5. 安装包位于 release/ 目录
# 文件名: ClawX Enhanced Setup 0.2.0-beta.4.exe
```

### 开发模式

```powershell
# 启动开发服务器 + Electron
pnpm electron:dev
```

### 测试清单

在其他电脑上测试时，请检查以下项目：

| 测试项 | 预期结果 |
|--------|----------|
| 安装程序运行 | 正常安装到指定目录 |
| 应用启动 | 显示 ClawX Enhanced 主界面 |
| OpenClaw 面板 | 显示 Gateway 状态、日志、控制按钮 |
| OpenCode 面板 | 显示终端、会话列表、日志 |
| 侧边栏切换 | 左侧导航可折叠/展开 |
| OpenCode 侧边栏 | 右侧终端可展开/收起 |
| 进程控制 | 启动/停止/重启按钮正常工作 |
| 架构页面 | 显示系统架构图和设计原则 |
| 设置页面 | 显示所有配置选项 |
| 底部状态栏 | 实时显示进程状态和系统信息 |

### 故障排除

**问题: OpenClaw 无法启动**
- 检查 Python 是否在 PATH 中
- 检查 `pip install openclaw` 是否成功
- 检查 `~/.openclaw/config.yaml` 配置文件

**问题: OpenCode 无法启动**
- 检查 Go 是否在 PATH 中
- 检查 `go install github.com/anomalyco/opencode@latest` 是否成功
- 检查 `~/.opencode.json` 配置文件

**问题: 构建失败**
- 确保 Node.js 版本 >= 22
- 运行 `pnpm install` 重新安装依赖
- 清除缓存: `pnpm store prune`

## 项目架构说明

### 进程隔离设计

```
Electron Main Process (Node.js)
├── OpenClaw Gateway (Python 子进程)
│   ├── AI Agent Runtime
│   ├── Skill/Plugin System
│   └── Channel Management
├── OpenCode Server (Go 子进程)
│   ├── AI Coding Agent
│   ├── Session Management
│   └── LSP Integration
└── IPC Bridge
    ├── WebSocket (主要)
    ├── HTTP REST (备选)
    └── stdin/stdout (降级)
```

### 关键设计决策

1. **双进程隔离**: OpenClaw 和 OpenCode 作为独立子进程运行，一个崩溃不影响另一个
2. **自动恢复**: 内建指数退避重启逻辑，最多尝试 5 次
3. **通信降级**: WebSocket → HTTP → stdin/stdout 三级降级策略
4. **安全存储**: API 密钥通过系统原生 Keychain 存储
5. **互助修复**: OpenClaw 出问题时可用 OpenCode 诊断修复
