---
type: sys
tags:
  - WSL
  - linux
status:
created: 2026-02-01 18:54
---
# ⚙️ Sysadmin-WSL配置

> [!WARNING] Configuration
> 涉及到系统底层配置，操作前请备份。

## ⚙️🌈



## WSL直接安装在D盘

直接从 **Ubuntu 官方镜像仓库** 下载专门为 WSL 准备的 **原生系统包 (`rootfs`)**。

这种方式**不需要解压、不需要修改文件、直接导入**，是最干净、最符合 `wsl --import` 逻辑的方法。

---

### 1️⃣ 第一步：下载官方原生镜像

这是 Ubuntu 官方提供的云镜像，地址是 `ubuntu.com` 域名，绝对稳妥。

- **下载地址（请复制到浏览器下载）**：

    https://cloud-images.ubuntu.com/wsl/releases/24.04/current/ubuntu-noble-wsl-amd64-24.04lts.rootfs.tar.gz
    
- **保存位置**：
    
    `D:\Repo\ISO`
    
- **文件名**：
    
    下载下来应该是 `ubuntu-noble-wsl-amd64-24.04lts.rootfs.tar.gz`（约 600MB）。
    

> **为什么这个最稳？**
> 
> 这是一个 `.tar.gz` 文件，它是 Linux 系统的原生压缩包。WSL 的导入命令就是专门为了读取这种文件设计的。你**不需要**解压它，直接喂给命令即可。

---

### 2️⃣ 第二步：导入系统 (Install)

打开 **PowerShell (管理员)**，执行以下命令。

PowerShell

```powershell
# 1. 创建安装目录 (如果之前没建)
mkdir D:\WSL\Ubuntu

# 2. 执行导入命令
# wsl --import <系统名> <安装位置> <下载的文件路径>
wsl --import Ubuntu-24.04 D:\WSL\Ubuntu D:\Repo\Images\ubuntu-24.04-server-cloudimg-amd64-wsl.rootfs.tar.gz
```

- _注意：系统名改成了 `Ubuntu-24.04`，这样更清晰。_
    
- _等待几秒钟，没有报错就是安装成功。_
    

---

### 3️⃣ 第三步：初始化账户 (必做)

^a1a35d

原生镜像默认是 Root 用户，我们需要设置你的个人账户。

1. **启动系统**：
    
    ```powershell
    wsl -d Ubuntu-24.04
    ```
    
2. **进入 Linux 终端后，依次输入以下命令**：
    
    ```bash
    # A. 创建用户 (把 'me' 换成你想要的名字，比如 'admin' 或你的英文名)
    adduser zzz
    # (按提示输入两次密码，其他的按回车跳过)
    
    # B. 赋予管理员权限 (否则你没法用 sudo 装软件)
    usermod -aG sudo zzz
    
    # C. 告诉 WSL 以后默认用这个用户登录
    echo -e "[user]\ndefault=zzz" > /etc/wsl.conf
    
    # D. 退出
    exit
    ```
    
1. **重启生效**（在 PowerShell 里）：
    
    ```powershell
    wsl --terminate Ubuntu-24.04
    wsl -d Ubuntu-24.04
    ```
    

现在，拥有了最新版、最纯净、直接安装在 D 盘的 Ubuntu 24.04 LTS 环境。

---
既然你已经拥有了完美的目录结构和手动配置的 WSL Ubuntu 24.04，安装 Docker 的最佳姿势是：**安装 Windows 版 Docker Desktop，但开启 WSL 2 集成，并把镜像数据存储在 D 盘。**

这样既能享受 GUI 管理的便利，又能让 Docker 在你的 Ubuntu 里直接运行命令，且不占用 C 盘空间。

---
## 安装Docker Desktop
### 1️⃣ 下载与安装

请将安装包下载到你的“仓库”中。

1. **下载**：
    [Docker Desktop for Windows Installer.exe](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-win-amd64)
    
2. **安装**：
    
    - 双击安装。
    - **务必勾选**：`Use WSL 2 instead of Hyper-V` (推荐)。
    - 安装完成后，**注销并重新登录** Windows（或者重启电脑）。
    - <font color="#ff0000">**务必不要勾选**</font>：`Allow Windows Containers to be used with this installation`。

---

### 2️⃣ 关键配置：迁移镜像存储到 D 盘

默认情况下，Docker 会把下载的镜像和容器存在 C 盘 (`%LOCALAPPDATA%\Docker\wsl`). 要把它改过去。

1. 启动 **Docker Desktop**。
    
2. 点击右上角的 **齿轮图标 (Settings)**。
    
3. 进入 **Resources** -> **Disk image location**。
    
4. **修改路径**：
    
    - 点击 Browse，选择 **`D:\WSL`** (或者新建一个 `D:\WSL\DockerData`)。
        
    - Docker 会提示你它需要移动数据，点击 **Apply & Restart**。
        

> **效果：** 以后你下载的几个 G 的 Kali 镜像、CentOS 镜像，都会乖乖躺在 D 盘的 `ext4.vhdx` 里。

---

### 3️⃣ 开启 WSL 集成 (打通任督二脉)

这一步是为了让你的 **Ubuntu-24.04** 终端里能直接识别 `docker` 命令。

1. 在 Docker Settings 里，点击 **Resources** -> **WSL integration**。
    
2. 勾选 **"Enable integration with my default WSL distro"**。
    
3. **关键点：** 在下方的 "Enable integration with additional distros" 列表中，**找到你刚才导入的 `Ubuntu-24.04`，打开开关**。
    
4. 点击 **Apply & Restart**。
    

---

### 4️⃣ 验证安装

现在，打开你的 **PowerShell** 或者直接进入 **Ubuntu 终端** 验证。

**在 Ubuntu 24.04 终端内输入：**

```Bash
# 1. 查看版本
docker --version
# 2. 跑一个测试容器
docker run hello-world
```

如果看到 `Hello from Docker!` 的欢迎语，说明：

1. Docker 引擎在 Windows 上运行。
    
2. 数据存储在 D 盘。
    
3. WSL的 Ubuntu 能够完美控制它。
    
