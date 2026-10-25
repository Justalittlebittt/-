# 第一章场景版（全动物使用几何拼块）

DEV_INTEGRATION，2026-10-25，V1.5，按HUMAN最新指令在独立chapter_preview入口制作第一章。复用既有8关数据、核心和输入行为，不重新生成关卡、不生成任何动物图。

已完成：开始→8关连续游玩→关卡成功/下一关→章节完成→重新游玩。复用原动物园背景、运输车/入口/木框和关卡牌视觉，统一暖色开始/结束卡片及右侧下一关按钮。没有额外操作栏，左键拖动/取回、右键旋转、R重置；操作说明在开始页。显示必要几何占位标识。

全动物均为有编号/颜色的完整占格轮廓，一次填色路径、一条连续外边界、一个piece_id；熊猫和兔子图也不加载。后续替换美术不改变occupied_cells。所有8关的形状/棋盘/障碍数据沿用已生成的原创候选。

背景文件保持a57d2a4c...原始字节。程序以原图1672×941坐标绘制完整环境，保留原木框，覆盖仅棋盘内表面(529,231,622,490)及牌上文字区(746,87,163,57)，在其上绘制当前尺寸棋盘和实际关号，避免烘焙5×4格线/第1关重复。动态棋盘位于框内，左右拼块按最大旋转尺寸和数量分配，800×600仍完整可抓取。此运行UI适配属于本轮交付，不修改原PNG，亦不改正式panda_v2入口。该适配尚需HUMAN视觉反馈，不宣称额外G3通过。

实际HTTP入口 test-browser.cjs 362项通过，1280×720/1024×768/800×600各完成真实鼠标8关，24次通关与3次章节结束/重玩，0pageerror；网络记录中assets/animals请求为0。取消、四向旋转、障碍/碰撞回退、取回重摆、R重置及满格解锁等沿用回归通过。截图检查了首关、末关、章节结束，框内原格线被覆盖、标题与当前关号一致，左右几何块无UI遮挡。

原正式第一关77项回归通过；tools/level_generator/test.cjs验证原第一关四份源文件和背景/熊猫/兔子PNG均与4af1403基线一致。逻辑生成与候选选择不变。运行依赖内容版本自动更新并校验。旧任务截图/报告保留在原Git历史，当前场景证据独立存放。

命令：
- python tools/version-runtime.py --entry experiments/chapter_preview/index.html --check
- node tools/level_generator/test.cjs
- 设置PREVIEW_TEST_URL为实际HTTP地址、PREVIEW_EVIDENCE_DIR=tasks/CHAPTER_ONE_SCENE_001/evidence、PREVIEW_REPORT_FILE=tasks/CHAPTER_ONE_SCENE_001/playtest_report.json 后运行 node experiments/chapter_preview/test-browser.cjs
- node experiments/panda_v2/test-content.cjs（原第一关回归）

PLAYWRIGHT_MODULE可指向已有Playwright包，测试使用本机Edge。试玩可用HTTP链接，也可下载builds/AnimalPuzzle_ChapterOne_Geometry.zip解压打开开始试玩.html，无需启动服务。动物美术未接入是本次明确范围；本次不声明最终发行验收完成。
