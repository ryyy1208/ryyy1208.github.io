---
type: sys
tags:
  - WSL
  - kali
status:
created: 2026-02-01 19:20
---
# ⚙️ Sysadmin-WSL版Kali安装
> [!WARNING] Configuration
> 涉及到系统底层配置，操作前请备份。
### ✅ 为什么要装 Kali WSL？
1. **免配置环境**：想用 Metasploit？想用 BurpSuite？想用 Nmap？在 Kali 里通常一条命令 `apt install` 甚至开箱即用。在 Ubuntu 里你可能要处理半天依赖报错。
    
2. **Win-KeX (GUI 图形界面)**：Kali 专门为 WSL 开发了 Win-KeX。你可以一键在 Windows 上打开一个完整的 Kali 图形化桌面，这对需要图形界面的工具（如 BurpSuite, Wireshark, Zap）非常重要。
    
3. **环境隔离**：你在 Kali 里随便折腾、攻击靶场，就算把系统搞崩了，直接删了重新导入镜像就行，不会影响你在 Ubuntu 里的开发环境。
    
---
### 🚀 安装步骤 (保持 D 盘纯净版)
用 `wsl --import` 方式把 Kali 安家在 `D:\WSL\Kali`。
#### 1. 下载 Kali 官方 Rootfs 镜像
Kali 官方提供了专门给 WSL 用的精简版层级包。
- **下载地址**：[kali-linux-2025.4-wsl-rootfs-arm64.wsl](https://kali.download/wsl-images/kali-2025.4/kali-linux-2025.4-wsl-rootfs-arm64.wsl)
    
    _(如果链接失效，请去  [kali.download/wsl-images](https://kali.download/wsl-images) 找最新的 wsl-rootfs)_
    
- **保存位置**：`D:\Repo\Images`
    
#### 2. 导入系统 (PowerShell 管理员)
```PowerShell
# 1. 创建目录
mkdir D:\WSL\Kali
# 2. 导入系统
wsl --import Kali D:\WSL\Kali D:\Repo\Images\kali-linux-2024.4-wsl-amd64.rootfs.tar.gz
```
#### 3. 初始化与安装工具集 (关键！)
**注意：** 为了体积小，下载的 Kali rootfs 默认是**“光杆司令”**（没有预装那几千个黑客工具）。需要进去手动安装一次“工具全家桶”。
1. **进入系统**：
    
    ```PowerShell
    wsl -d Kali
    ```
    
    ==(和 Ubuntu 一样，建议先按之前的步骤 adduser 创建个普通用户)==
    
2. **安装标准工具包 (Top 10 工具 + 常用工具)**：

    ```bash
    # 更新源
    apt update
    
    # 安装 Kali 标准工具集 (包含 nmap, metasploit, hydra 等)
    # 这一步会下载 2-3GB 的数据，解压后占用 10GB 左右
    apt install -y kali-linux-default
    ```
    
3. **安装图形化支持 (可选)**：
    
    如果你想要图形界面：
    
    ```Bash
    apt install -y kali-win-kex
    ```
    
    以后输入 `kex` 就能弹出图形界面。
    
---

Win-KeX 启动后黑屏或没有任何反应，是 WSL2 环境下**非常常见**的问题，通常是因为 Socket 连接被防火墙拦截，或者上一次的进程没关干净。


### 📺 尝试“增强会话模式” (RDP)

如果 Win-KeX 自带的 VNC 客户端实在显不出来，我们换一种协议。使用 Windows 自带的 RDP（远程桌面）协议来连接，这通常更稳定。
1. **启动增强模式：**

```Bash
kex--esm--ip
```

2.**操作：**

-这会弹出一个Windows的“远程桌面连接”窗口。
-**用户名：**输入你的Kali用户名。
-**密码：**输入你的 Kali 用户密码（不是 VNC 密码，是系统登录密码）。

---

### ✅ 解决方案：强制开启 WSL Interop

需要创建或修改 Kali 里的配置文件，明确告诉它：“允许运行 Windows 程序”。

#### 1. 编辑配置文件

在 Kali 终端中，使用 `nano` 编辑 `/etc/wsl.conf`：

```Bash
sudo nano /etc/wsl.conf
```

#### 2. 写入配置 (关键步骤)

检查文件里是否有内容。**不管有没有，请确保文件里包含以下这两段内容**（如果没有就粘贴进去，如果有 `enabled=false` 改成 `true`）：

```Ini, TOML
[interop]
enabled=true
appendWindowsPath=true

[automount]
enabled=true
mountFsTab=false
```

- **操作指南：**
    - 粘贴后，按 `Ctrl + O` 保存。
    - 按 `Enter` 确认文件名。
    - 按 `Ctrl + X` 退出编辑器。
#### 3. 彻底重启 WSL (必须做)

配置文件的修改不会立即生效，必须彻底关闭 WSL 实例。
**请回到 Windows 的 PowerShell (管理员) 执行：**

```PowerShell
# 强制关闭所有 WSL 实例
wsl --shutdown
```

等待几秒钟，然后重新启动 Kali：

```PowerShell
wsl -d Kali
```

#### 4. 再次尝试启动 Win-KeX

现在，Linux 应该能正确识别并运行 Windows 的 `.exe` 程序了。

```Bash
# 建议先用 IP 模式测试，最不容易报错
kex --esm --ip -s
```

---

