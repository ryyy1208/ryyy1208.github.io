<%*
/**
 * 智能路由模板 v3.0 (自动重命名 + 自动移动文件夹)
 */

// --- 配置区域：定义前缀对应的文件夹 ---
const CONFIG = {
    CYBER:   { folder: "10_Cyber",   template: "tpl_10_Cyber_Base" },
    DEV:     { folder: "20_Dev",     template: "tpl_20_Dev_Base" },
    SYS:     { folder: "30_Sys",     template: "tpl_30_Sys_Base" },
    PROJECT: { folder: "40_Project", template: "tpl_40_Project_Base" },
    BIOAI:   { folder: "60_BioAI",   template: null }
};

// 1. 获取当前状态
let title = tp.file.title;
let currentFolder = tp.file.folder(true);
let targetConfig = null; // 用于存储最终决定的 目标文件夹 和 模板
let newName = "";

// === 🛑 第一步：拦截“未命名”文件 ===
if (title.startsWith("Untitled") || title.startsWith("未命名")) {
    const inputName = await tp.system.prompt("📄 请输入笔记名称 (例如: Cyber-SQL注入)");
    if (inputName == null || inputName == "") { return; } // 取消则停止
    title = inputName;
    newName = inputName;
} else {
    newName = title;
}

// === 🔍 第二步：解析前缀，确定去向 ===
let trigger = "";
if (title.includes("-")) {
    const parts = title.split("-");
    trigger = parts[0].toLowerCase().trim();
    if (parts.length > 1) {
        newName = parts.slice(1).join("-").trim(); // 去除前缀
    }
}

// === 🧭 第三步：路由匹配 (匹配前缀) ===
switch (trigger) {
    // [网安]
    case "cyber": case "pentest": case "red": case "hack":
        targetConfig = CONFIG.CYBER;
        break;
    // [开发]
    case "dev": case "code": case "py": case "go":
        targetConfig = CONFIG.DEV;
        break;
    // [系统]
    case "sys": case "linux": case "wsl": case "env":
        targetConfig = CONFIG.SYS;
        break;
    // [项目]
    case "proj": case "lab": case "deepflow":
        targetConfig = CONFIG.PROJECT;
        break;
    // [生物AI]
    case "bio": case "bioai": case "protein": case "rf": case "mpnn":
        targetConfig = CONFIG.BIOAI;
        break;
    // [无前缀]
    default:
        // 如果没前缀，先看看是不是已经在正确的文件夹里了？
        if (currentFolder.startsWith(CONFIG.CYBER.folder)) targetConfig = CONFIG.CYBER;
        else if (currentFolder.startsWith(CONFIG.DEV.folder)) targetConfig = CONFIG.DEV;
        else if (currentFolder.startsWith(CONFIG.SYS.folder)) targetConfig = CONFIG.SYS;
        else if (currentFolder.startsWith(CONFIG.PROJECT.folder)) targetConfig = CONFIG.PROJECT;
        break;
}

// === 🖐️ 第四步：手动选择 (如果没匹配到) ===
if (!targetConfig) {
    // 构造菜单选项
    const options = [
        { label: "🔴 CyberSec (网安)", config: CONFIG.CYBER },
        { label: "🔵 Dev (开发)",     config: CONFIG.DEV },
        { label: "🟡 Sys (系统)",     config: CONFIG.SYS },
        { label: "🟢 Project (项目)", config: CONFIG.PROJECT },
        { label: "🟣 BioAI (生物AI)", config: CONFIG.BIOAI },
        { label: "⚪ Empty (仅创建)",  config: null }
    ];
    
    const chosen = await tp.system.suggester(
        options.map(o => o.label),
        options.map(o => o.config)
    );
    
    if (chosen) {
        targetConfig = chosen;
    }
}

// === 🚚 第五步：执行 重命名 和 移动 ===
// 1. 重命名 (如果名字变了)
if (newName && newName !== tp.file.title) {
    // 检查是否有重名文件
    if (await tp.file.exists(newName)) {
         new Notice("⚠️ 当前目录有重名文件，跳过重命名！");
    } else {
        await tp.file.rename(newName);
    }
}

// 2. 移动文件 (如果确定了目标文件夹，且当前不在那个文件夹)
if (targetConfig && targetConfig.folder) {
    // 检查当前是不是已经在那个文件夹里了
    if (!tp.file.folder(true).startsWith(targetConfig.folder)) {
        const targetPath = `${targetConfig.folder}/${newName}`;
        
        // 检查目标路径是否已存在同名文件
        if (await tp.file.exists(targetPath)) {
            new Notice(`⚠️ 目标文件夹 ${targetConfig.folder} 已存在同名文件，移动失败！`);
        } else {
            // 执行移动！
            await tp.file.move(targetPath);
            new Notice(`🚚 已移动到: ${targetConfig.folder}`);
        }
    }
}

// === 📝 第六步：应用模板 ===
if (targetConfig && targetConfig.template) {
    %><%- tp.file.include(`[[${targetConfig.template}]]`) %><%*
}
%>