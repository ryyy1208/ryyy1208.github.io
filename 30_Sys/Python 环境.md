---
type: sys
tags:
  - WSL
  - linux
status:
created: 2026-02-04 16:40
---
# ⚙️ Sysadmin-未命名

> [!WARNING] Configuration
> 涉及到系统底层配置，操作前请备份。

## ⚙️ Steps / Commands

这是一个非常合理的选择！

**✅ 建议：放进 `Envs`**

**理由：**

`uv` 本质上是 Python 的**环境管理器**（Package & Project Manager）。虽然它是一个工具（Tool），但它的核心职责是管理 Python 运行时和虚拟环境。把它放在 `Envs` 文件夹里，可以让你的“开发环境”逻辑非常闭环。

未来的结构看起来会很清晰：

Plaintext

```
Envs/
├── JDK/
├── NodeJS/
├── Go/
└── uv/       <-- Python 的大管家
```

---

### 🚀 也就是你的安装命令

假设你的文件夹在 `D:\Envs`，请使用以下命令（记得修改盘符）：

PowerShell

```
powershell -ExecutionPolicy ByPass -c {$env:UV_INSTALL_DIR = "D:\Envs\uv"; irm https://astral.sh/uv/install.ps1 | iex}
```

### 💡 两个小贴士

1. **关于子目录：**
    
    建议在命令里指定到 `...\Envs\uv`（如上所示），而不是直接指定到 `...\Envs`。
    
    - 因为 `uv` 安装脚本会在目录下创建 `bin` 等文件夹。如果直接装在根目录，可能会和其他语言环境的文件混在一起。
        
2. **关于环境变量 (PATH)：**
    
    安装完成后，`uv` 可能会提示你添加环境变量。
    
    你需要把 **`D:\Envs\uv\bin`** 添加到系统的 Path 中，这样你在任何地方打开终端都能直接敲 `uv` 命令。


使用 `uv` 来管理环境非常爽，因为它**速度极快**，而且不需要你预先手动安装 Python，它会自动帮你下载对应的 Python 版本。

鉴于你的 `Envs` 目录结构，我们把这两个环境分别命名为 **`PyBase`** (基础) 和 **`PyML`** (机器学习)，直接放在 `Envs` 根目录下。

请在 PowerShell 中执行以下步骤：

### 1. 进入你的环境目录

首先切换到我们存放环境的地方：

PowerShell

```
cd D:\Envs
```

---

### 2. 创建“基础环境” (PyBase)

这个环境用于日常脚本、爬虫或简单工具。我们用最新的 Python 3.12。

PowerShell

```
# 1. 创建名为 PyBase 的虚拟环境，指定 Python 3.12 (uv 会自动下载)
uv venv PyBase --python 3.12

# 2. 激活环境 (Windows)
.\PyBase\Scripts\activate

# 3. 安装常用基础库 (uv pip 速度极快)
# requests(网络请求), ipython(交互式终端), rich(漂亮的终端输出)
uv pip install requests ipython rich

# 4. 退出激活
deactivate
```

---

### 3. 创建“机器学习环境” (PyML)

这个环境用于你的 `DeepFlow` 项目或数据分析。

**注意：** 为了库的兼容性（特别是 PyTorch 和某些旧库），目前 **Python 3.11** 往往比 3.12 更稳妥。

PowerShell

```
# 1. 创建名为 PyML 的虚拟环境，指定 Python 3.11
uv venv PyML --python 3.11

# 2. 激活环境
.\PyML\Scripts\activate

# 3. 安装机器学习全家桶
# numpy, pandas (数据处理)
# scikit-learn (传统机器学习)
# torch (深度学习, uv会自动找适合你电脑的CPU/GPU版本)
# matplotlib, seaborn (绘图)
# jupyterlab (交互式笔记)
uv pip install numpy pandas scikit-learn torch matplotlib seaborn jupyterlab

# 4. 退出激活
deactivate
```

---

### 📂 最终你的目录结构 (`D:\Envs`)

这样你的 `Envs` 文件夹内部既有工具本身，也有具体的运行环境，非常清晰：

Plaintext

```
D:\Envs\
├── uv\          <-- [工具] uv 安装目录
├── PyBase\      <-- [环境] 基础 Python 3.12 + requests
├── PyML\        <-- [环境] 机器学习 Python 3.11 + PyTorch
├── JDK\         <-- [环境] Java
└── NodeJS\      <-- [环境] Node
```

### 💡 给你的额外建议 (VS Code 设置)

你写代码时肯定会用 VS Code。为了让 VS Code 识别出这两个环境：

1. 打开 VS Code。
    
2. 打开你的代码文件夹（比如 `CyberSec\Code`）。
    
3. 打开任意 `.py` 文件。
    
4. 点击右下角的 Python 版本号（或者按 `Ctrl+Shift+P` 搜 `Python: Select Interpreter`）。
    
5. 选择 **"Enter interpreter path"** -> **"Find..."**。
    
6. 浏览到 `D:\Envs\PyML\Scripts\python.exe`。
    

以后做 ML 项目选 `PyML`，写小脚本选 `PyBase`，切换自如。

截至目前（2026年初），对于机器学习（Machine Learning）和深度学习（Deep Learning），**最佳推荐版本**是：

### 🏆 **Python 3.11** （目前最稳、最兼容的选择）

虽然 Python 已经更新到了 3.12 甚至 3.13，但在搞 AI 这一行，**“新”不一定是最好的，兼容才是王道**。

以下是详细的避坑指南和选择理由：

---

### 1. 为什么选 Python 3.11？（推荐）

- **兼容性之王（The Sweet Spot）：**
    
    目前的机器学习生态链极其复杂（显卡驱动 -> CUDA -> PyTorch/TensorFlow -> NumPy -> 你的代码）。
    
    Python 3.11 发布已有一段时间，所有的主流库（PyTorch, TensorFlow, Scikit-learn, Pandas）以及**偏门的小众科学计算库**都完美支持它。
    
- **性能提升大：**
    
    相比 3.10，Python 3.11 在运行速度上有显著提升（官方称快了 10-60%），这对于处理数据的循环非常有利。
    
- **最稳妥：**
    
    你在用 `uv` 安装库时，选 3.11 几乎不会遇到“找不到对应版本 Wheel”的编译错误。
    

### 2. Python 3.12 能用吗？（可以用，但有风险）

- **现状：**
    
    PyTorch 和 TensorFlow 等巨头已经支持 3.12 了。如果你只用最主流的库（Torch + Pandas + Numpy），3.12 是完全没问题的，而且速度稍快一点。
    
- **风险点：**
    
    如果你在做网络安全（DeepFlow 项目），可能会用到一些**非主流的**网络包处理库或旧的加密库，这些库的开发者更新很慢，可能还没发布适配 3.12 的版本。一旦遇到这种情况，你还得降级，非常麻烦。
    

### 3. Python 3.13 / 3.14？（绝对不要用）

- **理由：**
    
    **太新了！** 很多科学计算库（涉及底层 C/C++ 编译的）通常需要半年到一年的时间来适配新版 Python。现在用这个版本做机器学习，你就是小白鼠，大把时间会浪费在解决“库装不上”的问题上。
    

---

### 💡 结合你之前的 `Envs` 目录策略

你在上一条指令中创建的规划非常科学，请坚持下去：

1. **`PyBase` (Python 3.12)**
    
    - **用途：** 写简单的脚本、自动化工具、爬虫。
        
    - **理由：** 追求最新语法和最快速度，依赖库少，不怕崩。
        
2. **`PyML` (Python 3.11)**
    
    - **用途：** 跑 `DeepFlow`、训练模型、PyTorch/TensorFlow。
        
    - **理由：** 追求**绝对的稳定性**。机器学习环境一旦配好（CUDA 版本对应上了、库之间不冲突），尽量不要动它。
        

### 🚀 重新确认你的创建命令

既然确定了 **3.11** 是 ML 的最佳伴侣，你的 `uv` 命令应该是：

PowerShell

```
# 进入你的环境目录
cd D:\Envs

# 创建机器学习专用环境，强制指定 3.11
uv venv PyML --python 3.11

# 激活
.\PyML\Scripts\activate

# 安装库 (uv 会自动找适配 3.11 的最佳版本)
uv pip install numpy pandas scikit-learn torch torchvision torchaudio
```

**总结：** 写小工具用新版（3.12），搞机器学习求稳用成熟版（3.11）。

在你的 **`PyML`** 环境中，有几种方法可以检查 GPU 是否可用。请按顺序操作：

### 1. 准备工作：先激活环境

首先确保你处于我们刚才创建的机器学习环境中（否则你检查的是系统默认 Python，可能没装 PyTorch）。

PowerShell

```
cd D:\Envs
.\PyML\Scripts\activate
```

---

### 2. 极简版（一行命令）

直接在终端粘贴这行命令，回车即可。

PowerShell

```
python -c "import torch; print(torch.cuda.is_available())"
```

- **返回 `True`**：🎉 成功！PyTorch 认出了你的显卡。
    
- **返回 `False`**：❌ 失败。PyTorch 只能用 CPU，没找到显卡。
    

---

### 3. 详细版（查看显卡型号）

如果你想看具体是哪张显卡在工作，或者是想确认 CUDA 的版本，可以用这行命令：

PowerShell

```
python -c "import torch; print(f'GPU可用: {torch.cuda.is_available()}'); print(f'显卡数量: {torch.cuda.device_count()}'); print(f'显卡型号: {torch.cuda.get_device_name(0)}' if torch.cuda.is_available() else '无'); print(f'CUDA版本: {torch.version.cuda}')"
```

**成功的输出示例：**

Plaintext

```
GPU可用: True
显卡数量: 1
显卡型号: NVIDIA GeForce RTX 4060
CUDA版本: 12.1
```

---

### ⚠️ 如果返回 `False` 怎么办？

如果你刚装好却显示 `False`，通常只有两个原因：

1. **装错了包（最常见）**：
    
    你可能默认安装了 CPU 版本。
    
    - **解决方法：** 在 `uv` 重新安装时，需要去 PyTorch 官网找对应 CUDA 版本的命令，或者让 `uv` 强制寻找 CUDA 版（通常 `uv` 会自动处理，但有时需要指定索引）。
        
    - 试试这个命令重装（强制安装 CUDA 12.1 版本）：
        
        PowerShell
        
        ```
        uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
        ```
        
2. **显卡驱动太老**：
    
    - **解决方法：** 去 NVIDIA 官网或者用 GeForce Experience 更新你的显卡驱动到最新。

`uv` 创建的虚拟环境完全兼容 Python 标准规范，所以**它没有专门的 `uv activate` 命令**，而是直接使用环境里自带的**标准激活脚本**。

鉴于你在 Windows 11 上，并且环境在 `D:\Envs` 下，以下是两种操作方式：

### 方式一：传统激活（推荐，最有仪式感）

这就是你习惯的“进入环境”模式，终端前缀会变。

假设你要激活 **PyML**（机器学习环境）：

1. **打开 PowerShell** (或者在 VS Code 的终端里)。
    
2. **执行激活脚本**：
    

PowerShell

```
# 如果你当前已经在 D:\Envs 目录下
.\PyML\Scripts\activate

# 如果你在其他任何地方 (绝对路径)
D:\Envs\PyML\Scripts\activate
```

- **成功标志：** 你的命令行前面会出现绿色的 `(PyML)` 字样。
    
    > `(PyML) PS D:\Envs>`
    
- **退出环境：** 输入 `deactivate` 回车即可。
    

---

### 方式二：极客模式（`uv run`，无需激活）

`uv` 提倡的一种新工作流：**你根本不需要手动激活环境**。

只要你在 `PyML` 文件夹里（或者即使不在，只要指定了环境），你可以用 `uv run` 直接把命令“发射”进环境里执行。

**场景：** 你想用 PyML 环境里的 Python 跑一个脚本 `train.py`。

PowerShell

```
# 即使你现在的终端没有 (PyML) 前缀
# 这条命令会自动使用 PyML 环境里的 python 解释器
uv run --directory D:\Envs\PyML python train.py
```

或者，如果你已经 `cd` 到了 `D:\Envs\PyML` 目录下：

PowerShell

```
cd D:\Envs\PyML
# 直接运行，uv 会自动探测到当前目录有个 .venv 或者环境配置
uv run python
```

### ⚠️ 常见报错解决 (PowerShell)

如果你运行 `activate` 时报错：

> _无法加载文件 ...\activate.ps1，因为在此系统上禁止运行脚本。_

这是 Windows 的安全策略。**解决方法**（管理员身份运行 PowerShell 执行一次即可）：

PowerShell

```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

输入 `Y` 确认。然后再试一次激活命令就 OK 了。

