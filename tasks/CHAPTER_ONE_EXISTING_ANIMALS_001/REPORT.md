# 熊猫与白兔原素材复用

2026-10-27 · DEV_INTEGRATION · 基线 `c771dec`

HUMAN指令：“先直接复用这两张”。本指令覆盖先前chapter_preview不启用这两张原图的解释。仅在当前八关注册两个整图映射，不重做、重编码、切割或替换原图；原正式第一关保持不变。

| 形状 | 既有批准原图 | 原始SHA-256 | 当前八关出现位置 |
|---|---|---|---|
| RECT6 | assets/animals/panda_rect6_desktop_001.png | e88018fb1b8d992834f11ca25303161f28ce2643db6deefe1555c03f54311732 | 第8关 |
| O4 | assets/animals/rabbit_square4_ears_folded_v2.png | 00ae48b4ee3c9f413cf996c239625f35a9ba946a8648225ed5dea9dc269ace74 | 第2、3、4、6关 |

熊猫沿用 `PANDA_RECT6_DESKTOP_APPROVED_001`，不是另一个历史V2哈希；白兔沿用 `RABBIT_SQUARE4_EARS_FOLDED_candidate_v2`。原图大小分别1173853/1208053字节，RGBA尺寸1536×1024/1254×1254。完整原画布等比居中映射到3×2/2×2，占格不变，零额外偏移。每个实例仍只有一个piece_id、一次完整PNG绘制，整只拾取、旋转、放置及取回。

文件/Alpha技术复核：原始PNG签名、哈希、字节大小、解码和RGBA通过；Alpha范围0–254/0–255，最外边最大Alpha均1。白、深色、粉色背景合成已查看，未发现明显残留底色或污染边。证据 `asset-report.json` 与 `evidence/RECT6-edges.png`、`O4-edges.png`。沿用既有来源记录，不将此项扩大为新的发行许可审核结论。

实际运行与验收：

- 两种既有形状和5个关卡实例的元数据、占格、版本及哈希一致；448个边界案例、40个碰撞案例通过。
- 八种已接入动物32个方向姿态，真实HTTP源入口鼠标拾取/拖动跟随/右键旋转/放置/取回及取消、失焦、R、相邻重摆回归，共243项检查通过，零页面错误。证据 `animal-browser-report.json`。
- 对实际ZIP解压物进行跨源iframe、嵌套子目录、全屏进入/退出与八关实际鼠标游玩：1280×720、1024×768、800×600三种尺寸共362项检查，24次关卡完成、3次完整章节通过；结束与重玩正常，资源无缺失、无脚本错误。
- 独立包包含8张整图动物与原背景，17文件、11229060字节，两次构建字节一致；SHA-256 `81b74d84597c18af8878bdc79d86097ce6117598fe996efa2f349daf1ef09ef7`。10项打包负向案例均拒绝成功。
- 对比基线，15份原有资产/程序/数据保持一致，包括全部9张已有PNG（8只动物+背景）、八关数据、共享核心、当前game.js和原panda_v2正式第一关。只增加这两个素材映射和HTML依赖内容版本，没有调整关卡或其他动物锚点。证据 `baseline-report.json`。

截图可查看 `package/evidence/iframe-chapter/level-1280-2.png`（兔子入场）和 `filled-1280-8.png`（熊猫与其他动物一起完成第8关）。相邻轮廓实测数据仍在 `package/iframe-playtest-report.json`，不声称所有可能摆法的像素轮廓完全不相交；本次熊猫第8关标准解无双方Alpha>200的轮廓交集。

重跑可使用现有数据驱动工具：

```powershell
python tools/assets/audit.py tasks/CHAPTER_ONE_EXISTING_ANIMALS_001/intake.json
$env:ASSET_TASK_DIR='tasks/CHAPTER_ONE_EXISTING_ANIMALS_001'
$env:ASSET_SPEC_FILE='intake.json'
node tasks/CHAPTER_ONE_ART_BATCH_001/test-geometry.cjs
$env:ANIMAL_REPORT_DIR='tasks/CHAPTER_ONE_EXISTING_ANIMALS_001'
node tasks/CHAPTER_ONE_ART_BATCH_001/test-animals.cjs
python tools/itch/build.py --browser --report-dir tasks/CHAPTER_ONE_EXISTING_ANIMALS_001/package
python tools/itch/test.py --report-dir tasks/CHAPTER_ONE_EXISTING_ANIMALS_001/package
```

现在当前入口为8种真实动物，仅D2、I3、I4保留完整几何占位。第1关仍按既有数据使用I3占位，未为提前展示熊猫或兔子重排关卡。HUMAN对两张原图的批准与本次启用指令已登记；当前八动物版本的实际用户复验另记，未上传itch平台或宣称正式发行完成。远端原始PNG读回证据见本任务 `github-readback.json`。

交付对接：开发期间DESIGN在远端追加了同项正式任务 `CHAPTER_ONE_PANDA_RABBIT_REUSE_001`。已读取并逐项满足该request，结果登记在其指定的 `handoff_dev_to_design.json`，本目录保留已执行证据；远端第三批美术任务和安排一并保留，未重复开发或重做素材。

推送及远端读回：复用实现`cbe4259`已随合并提交`59e33afed052837b391adebccbbdcec2ebaec403`推送main（保留DESIGN并行提交的第三批任务和复用派工）。从该合并提交GitHub raw实际下载熊猫与白兔PNG，均HTTP200，原始大小与批准SHA-256一致，结果见 `github-readback.json`。
