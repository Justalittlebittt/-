# 第二批动物整图接入验收

2026-10-26 · DEV_INTEGRATION · main基线 `57eb2f6` · V1.6

已读取最新 `request_to_art.json` 与 `PROJECT_STATE.yaml`。远端任务仍写READY_FOR_ART且没有最终原图哈希；以HUMAN本次明确批准P5河马、L4长颈鹿、L3柯尔鸭并要求从桌面读取最终版的指令作为G3依据。桌面每种只有一个对应文件，首次实测后在 `intake.json` 固定原始哈希，不冒称与不存在的远端预期哈希相符。原图仅复制，不重新生成、重编码、切割或修改Alpha。

| 形状 | 桌面文件 → 仓库原图 | 原始SHA-256 | 字节 / RGBA尺寸 |
|---|---|---|---|
| P5 | 河马.png → assets/animals/hippo_p5_desktop_002.png | 127c4466453cb349cf718bcb60af36711f82769b042d5067e21b2fed182304b1 | 1293147 / 1448×1086 |
| L4 | 长颈鹿.png → assets/animals/giraffe_l4_desktop_002.png | 722712b83ae535835856d353f7477ff15171f0f57ec7b96330691a0feb61d4ad | 1202037 / 1536×1024 |
| L3 | 鸭子.png → assets/animals/call_duck_l3_desktop_002.png | 3255a1bc5c9a3daaecf9b3d2364427237b3e0c6792189ffdff94a25c8a3b0b32 | 898041 / 1448×1086 |

G1文件/透明边缘技术项通过：PNG头、解码、RGBA、尺寸、原始大小和哈希均核验。三图Alpha范围分别0–255、0–254、0–255；画布最外边最大Alpha分别3、0、1。已查看白色、深色、粉色三种底色合成，未见可辨认底色块、残留场景或明显白黑边。证据为 `asset-report.json`、`evidence/*-edges.png`。HUMAN提供的项目素材来源已记录；生成器/提供商/具体许可条款未在ART请求中提供，独立发行许可元数据仍UNVERIFIED，本次不宣称完整发行就绪。

既定占格完全保留：P5五格 `[[0,0],[1,0],[0,1],[1,1],[0,2]]`；L4四格 `[[0,0],[0,1],[0,2],[1,2]]`；L3三格 `[[0,0],[0,1],[1,1]]`。分别用于既有八关的2、3、4个实例，共9个实例；未改动任何关卡数据。

整图登记参数：

- 河马原画为横向姿态，注册基准整图逆时针90°（baseRotation=3），与纵向P5逻辑对应；玩家旋转一次可回到原画横向。只改变整图绘制变换。
- 三图透明留白不同，使用 `sourceBounds` 登记主体包围范围，用于确定等比缩放和中心锚点。**没有用该范围裁切源纹理**：实际仍是一次五参数 `drawImage` 绘制完整原始PNG，不是九参数裁源图或逐格绘制。画布中的近透明边缘也未删除。
- 长颈鹿局部显示锚点向下0.12格，柯尔鸭向下0.08格；偏移随整只动物一起旋转，减少局部背部/尾缘进入空缺格。原始PNG、比例和occupied_cells不变。
- 初次八关视觉复核发现：后绘制的几何占位块会遮掉动物伸向邻格的局部轮廓，形成矩形缺口。Problem Elimination Pass直接消除这个覆盖步骤：先绘制不透明几何占位，再绘制完整动物，最后绘制当前拖拽对象。未通过裁格或修改碰撞来隐藏问题。

G2在测试范围内通过，保留局部自然延伸的事实：按Alpha>60诊断，P5右下空缺格覆盖约14.743%；L4中右空缺格从13.167%降为4.623%；L3右上从11.745%降为5.28%。三图空缺格中心在四方向测试中均保持透明。这些指标用于定位对齐，不是新设的通用美术放行阈值，也不声称逐像素轮廓等于格形。

实际八关标准解的相邻像素重叠另有量化：长颈鹿与邻接几何块最多约0.0464格面积，鸭尾与几何块约0.0497格，河马与鸭子约0.00389格（均为双方Alpha>200的交集）；完整轮廓可见、无主体或点击中心被遮挡。完整数据在 `package/iframe-playtest-report.json` 的 `neighbor_overlaps`。不以“零逻辑碰撞”冒充“零视觉像素延伸”，不对所有可能邻接摆法作未经实测的保证。

实际运行：

- G2逻辑与登记：新批三种形状四方向对照，672个边界案例、48个占格碰撞案例；9个既有实例占格、实际资源版本/哈希、基准尺寸、锚点与注册旋转逐项校验通过。
- 浏览器专项：**195项检查、六种已接入动物24个姿态**，真实鼠标整块拾取、拖动跟随、右键旋转、放置、取回、相邻重摆、非法/取消/失焦/R恢复及连续右键捕获回归，零页面错误。浏览器直接运行本地HTTP源入口，输出 `animal-browser-report.json`。
- 最终实际解压包：**362项检查、24次真实鼠标关卡完成、三次完整八关章节**，覆盖1280×720、1024×768、800×600；开始、满盘下一关、结束、重玩、全屏切换、跨源iframe及子目录资源加载通过，无缺失资源或页面错误。最终ZIP为15文件、9002297字节，SHA-256 `b7428623d0f853ff1bf87bf28aa23a29b459a7709b3cbd478538e8c9b2223e3d`，两次构建原始字节一致。
- 10项打包负向检查拒绝错误资源/路径/清单与未经完成动物发行门禁。导出器和浏览器资源检查改为按实际注册表识别PNG数量，消除“每增加一批都手工改固定3张计数”的重复问题。
- 基线保护：10份原有PNG/源码/关卡与基线一致；第一批三种动物四方向共12个图像变换与旧绘制器逐项数值一致，已批准的松鼠 `[-0.2,0]` 偏移保持不变。证据 `baseline-report.json`。

可重复执行：

```powershell
python tools/assets/audit.py tasks/CHAPTER_ONE_ART_BATCH_002/intake.json
$env:ASSET_TASK_DIR='tasks/CHAPTER_ONE_ART_BATCH_002'
$env:ASSET_SPEC_FILE='intake.json'
node tasks/CHAPTER_ONE_ART_BATCH_001/test-geometry.cjs
$env:ANIMAL_REPORT_DIR='tasks/CHAPTER_ONE_ART_BATCH_002'
node tasks/CHAPTER_ONE_ART_BATCH_001/test-animals.cjs
node tasks/CHAPTER_ONE_ART_BATCH_002/test-baseline.cjs
python tools/itch/build.py --browser --report-dir tasks/CHAPTER_ONE_ART_BATCH_002/package
python tools/itch/test.py --report-dir tasks/CHAPTER_ONE_ART_BATCH_002/package
```

Python审计需Pillow，浏览器需现有Playwright/Edge（必要时设置PLAYWRIGHT_MODULE）。所有原图仍可直接在 `assets/animals/` 查验。当前入口仍为 `experiments/chapter_preview/index.html`，六种真实动物与其余五种完整几何占位连玩八关；熊猫、白兔正式第一关及背景原始文件均未变更。HUMAN已于2026-10-26完成本轮实际试玩并确认没有问题（见下方通过记录）；尚未做itch在线发布。原始文件G3依据与运行试玩通过分别登记。

GitHub原始PNG提交后的实际远端下载结果归档为本任务 `github-readback.json`。

实现与PNG提交：`5ea55c922ff073d389c706fa07e9da49d8a482ab`，已推送main。随后从该提交的GitHub raw地址实际下载三张PNG，均HTTP200，大小与SHA-256全部等于桌面固定原图；详见 `github-readback.json`。

## HUMAN实际试玩通过（2026-10-26）

用户明确反馈：“试玩结束，没有问题，写入报告。”当前八关、六种完整动物版本的实际试玩验收通过。对应实现提交 `5ea55c922ff073d389c706fa07e9da49d8a482ab`，反馈时最新main文档提交 `e00cae6`。机器测试与本次真实用户试玩均已完成，各自证据分别保留；通过范围不扩大为剩余动物或平台发行完成。结构化记录见 `approval_receipt.json`。

熊猫/白兔未出现在本入口的原因：此前用户说“只是把所有的动物素材用格子来代替，已经做好的动物素材熊猫和兔子不用”，DEV将其解释为本八关入口暂不使用这两张图，后续两批派工只接入各自三种新动物，故当前注册表尚无 `RECT6 → panda`、`O4 → rabbit` 映射。这是当前内容启用范围及当时解释造成的，不是素材丢失、上传失败或无法复用。两张已批原始PNG已保存在仓库，原 `experiments/panda_v2/index.html` 的正式第一关仍加载两只熊猫与两只白兔；当前八关的同类形状显示占位。此条解释不擅自更改本轮启用范围，后续如接入只需复用原图并核验这两种映射与八关回归。
