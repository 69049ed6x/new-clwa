<h1 align="center">ClawX Enhanced</h1>

<p align="center">
  <strong>OpenClaw + OpenCode 双引擎桌面 AI 助手</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#为什么选择-clawx-enhanced">为什么选择</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#系统架构">系统架构</a> •
  <a href="#开发指南">开发指南</a> •
  <a href="#贡献指南">贡献指南</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue" alt="Platform" />
  <img src="https://img.shields.io/badge/electron-33+-47848F?logo=electron" alt="Electron" />
  <img src="https://img.shields.io/badge/react-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  <img src="https://img.shields.io/github/downloads/69049ed6x/new-clwa/total?color=%23027DEB" alt="Downloads" />
</p>

<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.en.md">English</a>
</p>

---

## 概述

**ClawX Enhanced** 是基于 [ClawX](https://github.com/ValueCell-ai/ClawX) 打造的增强版桌面 AI 应用，深度整合了 **OpenClaw Gateway** 与 **OpenCode** 双引擎。无需任何命令行操作，即可通过图形化界面同时管理 AI 对话代理和 AI 编程助手。

无论是自动化工作流、管理 AI 频道、定时任务调度，还是 AI 辅助编码，ClawX Enhanced 都能为您提供一个统一、流畅的桌面体验。

---

## 为什么选择 ClawX Enhanced

| 痛点 | ClawX Enhanced 解决方案 |
|------|------------------------|
| 复杂的命令行配置 | 图形化向导，一键完成初始化 |
| 多个 AI 工具切换 | OpenClaw 与 OpenCode 统一界面 |
| 进程管理困难 | 自动化进程监控与生命周期管理 |
| 多 AI 提供商配置 | 统一的提供商配置面板 |
| 技能/插件管理 | 内置技能市场，可视化安装管理 |
| AI 编码需要切换工具 | 集成 OpenCode 侧边栏，随时调用 |

---

## 功能特性

### 🎯 零配置门槛
从安装到第一次 AI 交互，全程通过直观的图形界面完成。无需终端命令，无需 YAML 文件，无需手动设置环境变量。

### 💬 智能对话界面
通过现代化聊天界面与 AI 代理交互。支持多对话上下文、消息历史记录、Markdown 富文本渲染，以及多代理 `@agent` 路由。

### 🖥️ OpenCode 集成侧边栏
从任意面板展开右侧 OpenCode 终端，随时执行 AI 编程任务、安装插件或诊断问题。OpenClaw 与 OpenCode 进程完全隔离，互不影响。

### 📡 多频道管理
同时配置和监控多个 AI 频道。每个频道独立运行，可针对不同任务部署专用 AI 代理。

### ⏰ 定时任务自动化
通过 Cron 表达式调度 AI 任务，让 AI 代理全天候自动工作，无需人工干预。

### 🧩 可扩展技能系统
通过内置技能面板浏览、安装和管理 AI 技能扩展，无需包管理器。预置完整文档处理技能（`pdf`、`xlsx`、`docx`、`pptx`）并在首次启动时自动部署。

### 📊 进程实时监控
实时查看 OpenClaw Gateway 和 OpenCode 两个进程的 CPU 占用、内存使用、运行时长等指标，以及完整的实时日志流。

### 🔐 安全凭证管理
通过系统原生密钥链安全存储 API 密钥等敏感信息，支持 OpenAI、Anthropic 等多种 AI 提供商。

### 🌙 自适应主题
支持浅色、深色或跟随系统的主题模式，自动适配您的使用偏好。

---

## 快速开始

### 系统要求

- **操作系统**：macOS 11+、Windows 10+、Linux（Ubuntu 20.04+）
- **内存**：最低 4GB RAM（推荐 8GB）
- **存储**：至少 1GB 可用磁盘空间

### 安装

#### 预编译发行版（推荐）

从 [Releases](https://github.com/69049ed6x/new-clwa/releases) 页面下载适合您平台的最新安装包：

| 平台 | 文件 |
|------|------|
| macOS (Apple Silicon) | `ClawX-Enhanced-*-mac-arm64.dmg` |
| macOS (Intel) | `ClawX-Enhanced-*-mac-x64.dmg` |
| Windows (x64) | `ClawX-Enhanced-*-win-x64.exe` |
| Linux (AppImage) | `ClawX-Enhanced-*-linux-x86_64.AppImage` |
| Linux (Debian/Ubuntu) | `ClawX-Enhanced-*-linux-amd64.deb` |

#### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/69049ed6x/new-clwa.git
cd "new-clwa/files.manuscdn.com/clawx-enhanced-electron"

# 安装依赖
pnpm install

# 开发模式启动
pnpm electron:dev
```

### 首次启动

首次启动时，**设置向导**将引导您完成：

1. **AI 提供商** — 添加 API 密钥（支持 OpenAI、Anthropic 等）
2. **技能包** — 选择预配置的常用技能
3. **配置验证** — 进入主界面前测试您的配置

### ⚠️ 安装注意事项

- **macOS**：首次启动可能提示"无法验证开发者"，前往「系统设置 → 隐私与安全性」允许运行即可
- **Windows**：SmartScreen 可能拦截安装程序，点击"更多信息" → "仍要运行"继续
- **Linux AppImage**：首次运行前执行 `chmod +x ClawX-Enhanced-*.AppImage` 添加执行权限

---

## 系统架构

ClawX Enhanced 采用**双子进程 + 统一主进程**架构：

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

### 设计原则

- **进程隔离**：AI 运行时在独立进程中运行，一个进程崩溃不影响另一个
- **统一控制面板**：前端请求通过统一的 host-api/api-client 接口，隐藏协议细节
- **主进程传输所有权**：Electron 主进程控制 WS/HTTP 使用和 IPC 回退，确保可靠性
- **安全存储**：API 密钥和敏感数据利用操作系统原生安全存储机制

---

## 使用场景

### 🤖 个人 AI 助手
配置通用 AI 代理，从桌面界面完成问答、邮件起草、文档摘要等日常任务。

### 💻 AI 辅助开发
通过集成的 OpenCode 侧边栏实现 AI 代码审查、文档生成和重复性编码任务自动化。

### 📊 自动化监控
设置定时 AI 代理监控资讯、价格追踪或特定事件监听，结果推送至您偏好的通知频道。

### 🔄 工作流自动化
将多个技能串联，构建复杂的自动化流水线，可视化编排数据处理、内容转换和动作触发。

---

## 开发指南

### 前置要求

- **Node.js**：22+（推荐 LTS 版本）
- **包管理器**：pnpm 9+
- **Go**：1.23+（用于 OpenCode）
- **Python**：3.11+（用于 OpenClaw）

### 项目结构

```
clawx-enhanced-electron/
├── electron/                  # Electron 主进程
│   ├── main.ts               # 主进程入口
│   ├── preload.ts            # 预加载脚本
│   └── services/
│       ├── openclawManager.ts # OpenClaw 进程管理
│       ├── opencodeManager.ts # OpenCode 进程管理
│       └── ipcBridge.ts      # IPC 通信桥接
├── src/                       # React 渲染进程
│   ├── components/           # UI 组件
│   ├── stores/               # Zustand 状态管理
│   └── pages/                # 页面组件
├── resources/                 # 应用资源（图标等）
├── package.json
├── electron-builder.yml       # 打包配置
└── vite.config.ts
```

### 常用命令

```bash
# 开发
pnpm dev                  # 启动开发服务器
pnpm electron:dev         # 启动 Electron 开发模式（含热重载）

# 构建打包
pnpm build:win            # 构建 Windows 安装包
pnpm build:mac            # 构建 macOS 安装包
pnpm build:linux          # 构建 Linux 安装包
```

### 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Electron 33+ |
| UI 框架 | React 19 + TypeScript |
| 样式 | Tailwind CSS + shadcn/ui |
| 状态管理 | Zustand |
| 动画 | Framer Motion |
| 构建 | Vite + electron-builder |
| AI Gateway | OpenClaw |
| AI 编码 | OpenCode |

---

## 贡献指南

欢迎社区贡献！无论是 Bug 修复、新功能、文档改进还是翻译，每一份贡献都让 ClawX Enhanced 变得更好。

### 如何贡献

1. **Fork** 本仓库
2. **创建**功能分支（`git checkout -b feature/amazing-feature`）
3. **提交**更改（附上清晰的提交信息）
4. **推送**到您的分支
5. **提交** Pull Request

---

## 致谢

ClawX Enhanced 站在优秀开源项目的肩膀上构建：

- [ClawX](https://github.com/ValueCell-ai/ClawX) — 原始桌面应用项目
- [OpenClaw](https://github.com/AgentrDev/OpenClaw) — AI Agent Gateway 运行时
- [OpenCode](https://github.com/anomalyco/opencode) — AI 编程代理
- [Electron](https://www.electronjs.org/) — 跨平台桌面框架
- [React](https://react.dev/) — UI 组件库
- [shadcn/ui](https://ui.shadcn.com/) — 精美 UI 组件集

---

## 许可证

ClawX Enhanced 基于 [MIT 许可证](LICENSE) 发布，您可以自由使用、修改和分发本软件。

---

<p align="center">
  <sub>基于 ClawX 项目构建 ❤️</sub>
</p>