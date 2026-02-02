---
type: sys
tags:
  - windows
  - 文件夹整理
status:
created: 2026-02-01 19:46
---
# ⚙️ Sysadmin-WIN11文件夹整理

> [!WARNING] Configuration
> 涉及到系统底层配置，操作前请备份。


### 💡 文件系统最终形态

如果结合你之前的 `_Portable` 和 `CyberSec`，你的硬盘根目录现在看起来会非常清爽、逻辑分明：

Plaintext

```
D:\ (或者你的根目录)
├── Program          (软件安装目录)
│   ├── _Portable    (日常便携软件，加下划线置顶)
├── 
├── CyberSec         (网络安全基地)
│   ├── Code
│   ├── Data
│   ├── Docs
│   ├── Labs
│   └── Tools
├── Repo             (保存ISO镜像和软件安装包)
│   ├── ISO
└── Envs             (或者 SDKs，存放 Python/JDK 等语言环境)
    ├── Java
    ├── Python
    ├── NodeJS
    └── Go
```

### 🛠️ 特别技术提示

既然你把这些环境单独放在一个文件夹，**切记**要管理好系统的 **环境变量 (Environment Variables)**：

因为这些是“绿色/便携”放置的（不是通过安装包安装到 C 盘默认路径），你需要手动把它们的 `bin` 目录添加到系统的 `Path` 中，否则你在命令行输入 `python` 或 `java` 时，系统会提示找不到命令。

**建议：**
选定 **`Envs`** 这个名字，既顺口，又符合你之前设定的 4 字母极简风格。
