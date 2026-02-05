---
type: sys
tags:
  - WSL
  - linux
  - 代理
status:
created: 2026-02-04 10:43
---
# ⚙️ Sysadmin-WSL配置代理

> [!WARNING] Configuration
> 涉及到系统底层配置，操作前请备份。

## ⚙️ Steps / Commands

### 1. Prerequisite
通过 `ip route` 获取网关，并自动检测代理是否真的能连接到宿主机。

### 增强版一键代理脚本 (`proxy.sh`)

Bash

```
#!/bin/bash

# --- 配置区 ---
# 请将 10808 修改为你的代理软件端口
DEFAULT_PORT=1080 
# --------------

# 1. 动态获取宿主机 IP (WSL2 默认网关)
HOST_IP=$(ip route show | grep default | awk '{print $3}')

# 如果获取失败，回退到 resolv.conf 方案
if [ -z "$HOST_IP" ]; then
    HOST_IP=$(grep nameserver /etc/resolv.conf | awk '{print $2}')
fi

PROXY_ADDR="http://${HOST_IP}:${DEFAULT_PORT}"

function set_proxy() {
    # 检查宿主机端口是否真的通畅
    timeout 1 bash -c "</dev/tcp/${HOST_IP}/${DEFAULT_PORT}" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo -e "\033[31m[错误] 无法连接到宿主机 ${HOST_IP}:${DEFAULT_PORT}\033[0m"
        echo "请检查：1. 代理软件是否开启 'Allow LAN'；2. Windows 防火墙是否允许端口 ${DEFAULT_PORT}"
        return 1
    fi

    # 设置环境变量
    export http_proxy="${PROXY_ADDR}"
    export https_proxy="${PROXY_ADDR}"
    export ALL_PROXY="${PROXY_ADDR}"
    
    # 设置 Git 代理
    git config --global http.proxy "${PROXY_ADDR}"
    git config --global https.proxy "${PROXY_ADDR}"
    
    echo -e "\033[32m[✓] 代理已开启！\033[0m"
    echo "地址: ${PROXY_ADDR}"
}

function unset_proxy() {
    unset http_proxy https_proxy ALL_PROXY
    git config --global --unset http.proxy
    git config --global --unset https.proxy
    echo -e "\033[33m[!] 代理已关闭\033[0m"
}

# 命令逻辑
case "$1" in
    on)  set_proxy ;;
    off) unset_proxy ;;
    *)   echo "用法: proxy on | proxy off" ;;
esac
```

---

### 如何安装并永久生效

1. **创建文件**：`vim ~/proxy.sh`，粘贴上面的内容并保存。
    
2. **设置别名**（如果你之前没设过）：
    
    打开配置文件：`vim ~/.bashrc`
    
    在末尾加上：`alias proxy="source ~/proxy.sh"`
    
3. **刷新配置**：`source ~/.bashrc`
    

---

### 关键：如果运行 `proxy on` 报错“无法连接”

这说明你的宿主机正在“拒收”WSL 的流量。请执行以下**两个核心操作**：

#### 1. 代理软件必须长这样（以 Clash 为例）

确保 **Allow LAN** (允许局域网) 的开关是 **绿色/开启** 状态。

#### 2. Windows 命令行放行规则（最重要）

即便你关闭了防火墙，有时虚拟网卡依然受限。在 Windows **管理员权限的 PowerShell** 中运行这一行：

PowerShell

```
# 这一行彻底放行 WSL 网卡的入站流量
New-NetFirewallRule -DisplayName "WSL Traffic" -Direction Inbound -InterfaceAlias "vEthernet (WSL)*" -Action Allow
```

---

### 测试结果

现在试试输入 `proxy on`。如果提示 `[✓] 代理已开启！`，你可以直接输入 `curl -I https://www.google.com` 看看有没有 `200 OK`。

