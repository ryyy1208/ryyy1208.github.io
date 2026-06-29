---
title: COMMAND_CENTER
layout: full
cssclasses: [dashboard]
date: 2026-02-01
---

```text
   _____            __                  _____          
  / ___/            \ \                / ___/          
  \ \__  __  __  ___ \ \____   ___     \ \__  ___  ___ 
   \__ \/ / / / / __| >  __ \ / _ \     \__ \/ _ \/ __|
  ____/ / /_/ / \__ \/ /  / //  __/    ____/ / __/ /__ 
 /_____/\__, /  |___/_/  /_/ \___/    /_____/\___/\___|
       /____/                                          
                       >> SYSTEM_ONLINE // USER: ROOT

```

<div align="center">

</div>

---

### 💡 Obsidian 的内部结构

网安和技术的学习笔记非常杂，建议在 `D:\Docs` 内部采用 **PARA 变体** 或 **技术栈分类**：


```Plaintext
D:\Docs\
├── 00_Inbox      (收件箱：速记、未整理的截图)
├── 10_Cyber      (网安：红队、渗透、CTF Writeups)
├── 20_Dev        (开发：Python, Go, Docker 笔记)
├── 30_Sys        (系统：Linux 指令, Windows 配置)
├── 40_Project    (项目：正在进行的 DeepFlow 等项目日志)
├── 60_BioAI      (生物AI：蛋白质设计、RFdiffusion、ProteinMPNN)
├── 90_Config     (配置：模板、主题)
└── 99_Archive    (归档：学完的教程)
```

**最后一步建议：** 用 **Git** 来管理你的 `Docs` 文件夹，这样你的笔记就有了版本控制，永远不会丢，还能回滚。

## 📊 SYSTEM STATUS

```dataviewjs
// 自动统计各分区笔记数量并生成进度条
const pages = dv.pages('"/"');
const cyber = pages.filter(p => p.file.folder.startsWith("10_Cyber")).length;
const dev = pages.filter(p => p.file.folder.startsWith("20_Dev")).length;
const sys = pages.filter(p => p.file.folder.startsWith("30_Sys")).length;
const proj = pages.filter(p => p.file.folder.startsWith("40_Project")).length;
const bioai = pages.filter(p => p.file.folder.startsWith("60_BioAI")).length;

// 定义最大容量用于计算百分比 (假定目标是每个区50篇，可修改)
const max = 50; 

function progressBar(count, total) {
	const percentage = Math.min(count / total, 1);
	const barLength = 15;
	const filled = Math.round(barLength * percentage);
	const empty = barLength - filled;
	return "▓".repeat(filled) + "░".repeat(empty);
}

dv.paragraph(`
| 🗄️ ZONE ACCESS | 🔢 FILES | 🔋 CAPACITY LOAD |
| :--- | :--- | :--- |
| **[[10_Cyber/index|🔴 SECTOR 10 (CYBER)]]** | **${cyber}** | ${progressBar(cyber, max)} |
| **[[20_Dev/index|🔵 SECTOR 20 (DEV)]]** | **${dev}** | ${progressBar(dev, max)} |
| **[[30_Sys/index|🟡 SECTOR 30 (SYS)]]** | **${sys}** | ${progressBar(sys, max)} |
| **[[40_Project/index|🟢 SECTOR 40 (LABS)]]** | **${proj}** | ${progressBar(proj, max)} |
| **[[60_BioAI/index|🟣 SECTOR 60 (BIOAI)]]** | **${bioai}** | ${progressBar(bioai, max)} |
`)

```

---

## 📡 MISSION CONTROL

<div style="display: flex; flex-wrap: wrap; gap: 10px;">

<div style="flex: 1; min-width: 300px;">

> [!DANGER] [[10_Cyber/index|🔴 OFFENSIVE OPS]]
> **最新情报与渗透记录**
> ```dataview
> LIST WITHOUT ID file.link
> FROM "10_Cyber"
> WHERE file.name != "index"
> SORT file.mtime desc
> LIMIT 5
> 
> ```
> 
> 
> `root@kali:~# msfconsole -q`

</div>

<div style="flex: 1; min-width: 300px;">

> [!INFO] [[20_Dev/index|🔵 BUILDER FACTORY]]
> **代码片段与构建日志**
> ```dataview
> LIST WITHOUT ID file.link
> FROM "20_Dev"
> WHERE file.name != "index"
> SORT file.mtime desc
> LIMIT 5
> 
> ```
> 
> 
> `docker build -t cyber-tool .`

</div>

</div>

<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">

<div style="flex: 1; min-width: 300px;">

> [!WARNING] [[30_Sys/index|🟡 INFRASTRUCTURE]]
> **系统配置与底层协议**
> ```dataview
> LIST WITHOUT ID file.link
> FROM "30_Sys"
> WHERE file.name != "index"
> SORT file.mtime desc
> LIMIT 5
> 
> ```
> 
> 
> `systemctl status firewalld`

</div>

<div style="flex: 1; min-width: 300px;">

> [!SUCCESS] [[40_Project/index|🟢 INCUBATOR]]
> **长期项目与研究**
> ```dataview
> LIST WITHOUT ID file.link
> FROM "40_Project"
> WHERE file.name != "index"
> SORT file.mtime desc
> LIMIT 5
> 
> ```
> 
> 
> `git commit -m "feat: new module"`

</div>

</div>

<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">

<div style="flex: 1; min-width: 300px;">

> [!TIP] [[60_BioAI/index|🟣 BIOAI LAB]]
> **蛋白质设计与AI生信**
> ```dataview
> LIST WITHOUT ID file.link
> FROM "60_BioAI"
> WHERE file.name != "index"
> SORT file.mtime desc
> LIMIT 5
> 
> ```
> 
> 
> `python inference.py --config config.yaml`

</div>

</div>

---

## 🚀 ACTIVE MONITOR: DeepFlow

> [!ABSTRACT] Project: DeepFlow (AI Traffic Detection)
> **状态**: 🟢 开发中 | **优先级**: 🔥 High
> | Task | Progress |
> | --- | --- |
> | **Dataset** | `[▓▓▓▓▓▓▓▓▓▓] 100%` ✅ |
> | **Training** | `[▓▓▓▓░░░░░░] 40%` 🔄 |
> | **Docs** | `[▓▓░░░░░░░░] 20%` 📝 |
> 
> 
> **相关文档**:
> ```dataview
> TABLE without id file.link as "📄 文件", dateformat(file.mtime, "MM-dd") as "📅 更新"
> FROM "40_Project"
> WHERE contains(file.name, "DeepFlow") OR contains(file.tags, "DeepFlow")
> SORT file.mtime desc
> LIMIT 3
> 
> ```
> 
> 

---

## 🕒 GLOBAL TIMELINE

> [!EXAMPLE] Recently Modified Files
> ```dataview
> TABLE without id 
> 	file.link as "📄 File Name", 
> 	file.folder as "📂 Sector", 
> 	dateformat(file.mtime, "MM-dd HH:mm") as "🕒 Timestamp"
> FROM ""
> WHERE file.name != this.file.name AND file.name != "index"
> SORT file.mtime desc
> LIMIT 10
> 
> ```
> 
> 

---

<div align="center">




`ECHO "KNOWLEDGE IS POWER"`
`EXIT CODE 0`

</div>

```
