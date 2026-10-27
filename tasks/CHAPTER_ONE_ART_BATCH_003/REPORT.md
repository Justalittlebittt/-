# 第三批正式技术交接：第一章11种完整动物

2026-10-27 · DEV_INTEGRATION → DESIGN_DIRECTOR · V1.6 · 基线main `ad8ccef`

**结论：第三批本地文件、透明边缘、占格/旋转及实际游戏/导出包技术验证通过。现有8关的34个实例全部使用11种完整动物PNG，零几何占位。尚未声明正式Demo可发布：G1完整来源/许可元数据未提供，当前11动物运行版本已获HUMAN试玩成功反馈，真实itch托管验证尚未完成。** 逐项状态见 `release_gate_review.json`，不要将本次技术结论扩大为发布许可。

## 1. 输入与准确原图

已同步最新main，读取V1.6合同、项目状态及本任务 `handoff_art_to_design.json`。交接确认三只均已获HUMAN G3，但没有提供原始SHA-256或候选版本字符串。按HUMAN当前指令，从唯一桌面交付目录读取对应最终PNG，结合物种/姿态核对：睡眠豚鼠、仰躺抱石水獭、半睁眼慵懒鳄鱼。首次实测哈希固定在 `intake.json`，未冒称与不存在的远端预期哈希一致；DEV登记版本名不冒充ART候选ID。

| 形状 | 交接文件名 / 本机最终名 | 仓库原始PNG | SHA-256 | 字节 / RGBA尺寸 |
|---|---|---|---|---|
| D2 | 卡通棕白睡眠豚鼠素材.png / 豚鼠.png | assets/animals/guinea_pig_d2_desktop_003.png | c81e7fb131285be564b1fb400f9854e2f76343b7fb5ee86d593ca90d2dd4efa7 | 892562 / 1448×1086 |
| I3 | 横躺抱石的可爱水獭.png / 水獭.png | assets/animals/otter_i3_desktop_003.png | a5370d6232a77150a9ae71d750265dcfd453d85a7e9e151c5315463073040c94 | 823220 / 2006×784 |
| I4 | 慵懒侧卧的卡通鳄鱼.png / 鳄鱼.png | assets/animals/crocodile_i4_desktop_003.png | 4195db5453c276c9ea05868d16d17fa7c925578ddd764c423b12fb4dcc364ba9 | 892531 / 2172×724 |

本地源为 `C:/Users/Administrator/Desktop/动物拼图美术素材/`，原始bytes直接复制，未重绘、重编码、裁图、变形、删Alpha或分拆动物。PNG不缺失；未使用历史替代图。元数据为 `assets/animals/chapter_one_batch_003.json`。

## 2. G1文件与透明边缘

PNG头、完整解码、RGBA、尺寸、大小、固定原始SHA-256通过。三张Alpha均0–255，画布最外边Alpha最大均1；查看白、深色、粉色背景合成，未见可辨认底色块、场景残留或明显白黑污染边。完整原图仍按一次五参数drawImage显示；sourceBounds仅登记透明留白的等比缩放与锚点，不是裁切源纹理。

主体定位范围分别为 `[24,248,1425,853]`、`[54,134,1966,682]`、`[30,121,2146,580]`，均零额外偏移、零基准旋转。图像与碰撞使用同一实例变换，整只移动/旋转/放置/取回。证据为 `asset-report.json`、`evidence/D2-edges.png`、`I3-edges.png`、`I4-edges.png` 和四方向套格图。

**G1技术文件项PASS，G1完整发行来源/许可项UNVERIFIED。** ART交接没有生成器/提供商/具体许可细目，三张PNG内嵌元数据也均为空。已记录HUMAN交付与G3批准，但不能由视觉批准推断未提供的许可字段。见 `provenance-check.json`。

## 3. G2占格、四方向与邻接

- D2严格保留 `[[0,0],[1,0]]`；I3严格保留 `[[0,0],[1,0],[2,0]]`；I4严格保留 `[[0,0],[1,0],[2,0],[3,0]]`。
- D2复用8个实例、I3复用4个实例、I4复用1个实例，原8关JSON未变。未为让旋转容易而改变棋盘、阻挡格或解。
- 新批672个边界、36个占格碰撞案例通过；手工坐标旋转公式与核心旋转结果对照通过，运行配置版本/哈希、尺寸、主体范围逐项匹配。
- 共11种动物44个姿态在真实鼠标下测试整图拾取、旋转、放置与取回。I3在第一关3×2棋盘竖放越界是正确行为，新增实际落点测试确认静默回滚；需要合法竖放的方向测试选用现有较高棋盘，没有修改关卡。
- 标准解邻接采样仍保留小幅自然轮廓交叠的真实数据：第3关L4与D2为约0.01556格面积，第6关P5与L3约0.00389格、L3与I3约0.01278格（双方Alpha>200）。已查看实际画面，未见主体或关键点击区域被不合理遮挡。不是零像素交集保证，更不推定所有可能摆法均已穷举。

证据：`geometry-report.json`、`animal-browser-report.json`、`source-playtest-report.json` 的neighbor_overlaps、`evidence/four-rotation-overlays.png` 及代表性实际截图。

## 4. G4实际操作与导出包

| 验证入口 | 实际结果 |
|---|---|
| 本地HTTP专项 | 315项检查、44姿态，原子拖动/右键旋转/放置/取回、相邻重摆、非法回滚、取消/失焦/R及连续右键捕获回归通过，零页面错误 |
| 本地HTTP连续八关 | 370项检查；1280×720、1024×768、800×600三种尺寸，各从开始完整操作8关至结束再重玩；24次真实鼠标关卡完成、3次完整章节 |
| 实际ZIP解压物 | 另370项检查、24次真实关卡完成、3次完整章节；隔离子目录、准确大小写资源、跨源sandbox iframe、全屏进入/退出通过，零缺失资源/脚本错误 |
| 完整动物覆盖 | 全部34实例均有已加载PNG；显式断言所有8关形状已注册、零几何占位，不靠占位测试代替正式素材运行 |
| 构建与负向校验 | 两次ZIP构建字节相同；10个错误资源/路径/清单/未授权发布模式案例拒绝成功 |

源码与导出包合计48次实际关卡完成、6次完整章节，操作记录分别保存，不把解算器结果当作真实鼠标测试。完整JSON记录每种尺寸的每关；截图只保留代表性新动物、最小/最大棋盘、邻接与章节结束画面，以减少重复证据体积。

当前产物 `builds/itch/animal-puzzle-chapter-one-test.zip`，20文件、13527481字节，包含11张完整动物与原背景，无外部服务/CDN/字体依赖。SHA-256：`0d536920cd133681f51e57c54349678aab0208f5041c7e7e277899371efacd86`。HTML根入口index.html，大小写/相对路径/子目录闭环及实际解压资源已验证；这是本地HTML5测试包，不是实际itch上传记录。

## 5. 严格保留项

`baseline-report.json` 对比 `ad8ccef`：原8张动物PNG与背景、原正式第一关、共享核心、当前game.js和8关数据等15份文件保持不变；旧8种动物注册对象逐项相同，完整PNG绘制器正文也未修改。松鼠已批 `[-0.2,0]` 偏移及其他已批锚点均保留。

本轮程序接入只增加3条素材映射并更新HTML依赖内容版本；界面去掉已经失真的“其余形状为占位”字样。测试工具为I3选择能容纳该旋转方向的既有关卡；没有新引擎、关卡重生成、剧情、背景修改或扩关。导出包改用中性的全动物本地测试名称；`--release`仍明确拒绝发布，不再错误声称当前仍有几何占位。

## 6. 复验命令与后续交接

```powershell
python tools/assets/audit.py tasks/CHAPTER_ONE_ART_BATCH_003/intake.json
$env:ASSET_TASK_DIR='tasks/CHAPTER_ONE_ART_BATCH_003'
$env:ASSET_SPEC_FILE='intake.json'
node tasks/CHAPTER_ONE_ART_BATCH_001/test-geometry.cjs
$env:ANIMAL_REPORT_DIR='tasks/CHAPTER_ONE_ART_BATCH_003'
node tasks/CHAPTER_ONE_ART_BATCH_001/test-animals.cjs
$env:PREVIEW_TEST_URL='http://127.0.0.1:8765/experiments/chapter_preview/index.html'
$env:PREVIEW_EVIDENCE_DIR='tasks/CHAPTER_ONE_ART_BATCH_003/evidence/source-chapter'
$env:PREVIEW_REPORT_FILE='tasks/CHAPTER_ONE_ART_BATCH_003/source-playtest-report.json'
node experiments/chapter_preview/test-browser.cjs
python tools/itch/build.py --browser --report-dir tasks/CHAPTER_ONE_ART_BATCH_003/package
python tools/itch/test.py --report-dir tasks/CHAPTER_ONE_ART_BATCH_003/package
```

使用现有Pillow、Playwright和Edge，必要时设置PLAYWRIGHT_MODULE。正式机器交接为 `handoff_dev_to_design.json`，发布状态矩阵为 `release_gate_review.json`。GitHub提交后实际下载原始PNG验证的记录为 `github-readback.json`。

交由DESIGN汇总来源/许可字段、审核完整运行版及最终发行范围，HUMAN可直接试玩当前11动物版；真实itch上传/托管验收另行执行。本次交接不提前宣布Demo具备正式发布条件。

## 7. GitHub最终字节核验

实现与原始PNG已提交并推送main：`7d795f578b7d1ffbbaeaf3e4861b338384e6e0c1`。随后从该提交的GitHub raw地址实际下载三张PNG，全部HTTP200，大小与SHA-256逐一等于桌面固定原图；不是只比较本地Git blob。证据 `github-readback.json`。第三批文件交付、G2与本地G4闭环完成，正式发布状态仍按前述矩阵保留，不因推送成功自动升级。

## 8. HUMAN实际试玩反馈（2026-10-27）

用户明确回复“试玩成功”。已将当前11动物版本运行试玩通过写入 `approval_receipt.json`、开发交接和项目状态；未将此反馈扩展为音效功能或正式公开发行已通过。随后用户要求检查点击动物播放声音的接口，核查结果单独见 `tasks/ANIMAL_CLICK_AUDIO_AUDIT_001/REPORT.md`。
