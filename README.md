# 动物拼图游戏（AI 游戏开发）

原创动物园主题二维多格动物拼图。首版以「运输与入园安置」为主题；完整可发布开发周期暂定不超过 7 天，重点验证真实玩家评价，而非追逐营收。此仓库 `Justalittlebittt/-` 的默认分支为 `main`。

## 唯一现行合同

- **[统一制作合同 V1.3](docs/contracts/ANIMAL_PUZZLE_PRODUCTION_V1.3.md)**：唯一现行项目制作合同；包括 Codex 本地开发、节省 AI 额度和 G0–G5 验收。
- [通用协作协议 V1.0](docs/contracts/UNIVERSAL_PROTOCOL_V1.0.md)：单 Owner、证据、问题消除、合同变更。
- [Project Manifest](manifest/PROJECT_MANIFEST.yaml)：项目静态参数和未冻结事项。
- [Project State](state/PROJECT_STATE.yaml)：当前任务状态与实际测试证据。状态应服从已验证的仓库事实；历史记录不自动代表最新结论。
- [Codex 启动指引](AGENTS.md)：本地开发 AI 快速进入项目的路径。
- [任务交接模板](interface/HANDOFF_TEMPLATE_V1.0.yaml)：新任务按 V1.3 执行。

## 当前角色

- **DESIGN_DIRECTOR / GPT 策划页**：玩法、关卡、资源预算和玩家体验。
- **ART_EXPERIENCE / GPT 美术页**：原创动物素材、Style Kit、候选、用户视觉 G3 验收包。
- **DEV_INTEGRATION / 本地 Codex**：唯一开发 Owner；游戏逻辑、测试、真实 PNG 接入、构建和 Git 管理。原「动物拼图开发001」为历史档案，不再产生新开发任务。
- **HUMAN / 制作人**：重大范围与美术版本批准；必要时一次保存获批原始图片至 Codex 可见的 `assets/inbox/`；不需手动把每张 PNG 上传 GitHub。

## 现有实验，不等于正式游戏

- `experiments/panda_v2/index.html`：最新仓库归档的熊猫 V2 三关交互实验；现使用用户桌面已批准原图 `assets/animals/panda_rect6_desktop_001.png`，真实 PNG 三关浏览器回归已通过；历史 V2 哈希保留作版本区分。见 [说明](experiments/panda_v2/README.md)。
- `experiments/first_playable_001/`：更早的两关 HTML/JS 原型，已做局部测试但正式仓库版 G4 未完成。
- `tasks/`、`docs/reviews/`：既有任务与证据，不因角色迁移而改写。

GitHub 支持 PNG 二进制；旧阻断是 GPT 环境之间原始文件不可达，不是 GitHub 本身拒绝 PNG。现在由 Codex 本地管理真实文件、校验并执行 Git 提交。候选素材未实际到达本地时必须标记 `UNVERIFIED/BLOCKED`，不得用替代图冒充已批准版本。

## 历史文档

生产 V1.0/V1.1/V1.2、旧 ART_STYLE V1.4、ASSET_PIPELINE V0.3/V0.4/V0.4.1 及旧协作手册保留作历史，不作为并列现行合同；老任务的历史证据与绑定版本原样保留。
当前素材交付规则：HUMAN 已确认本机桌面 `动物拼图美术素材` 文件夹现有及今后交付素材均已视觉验收，DEV 逐文件登记哈希、完成技术检查和Git入库，无需逐张重新批准。详见 AGENTS.md 更新与 `tasks/LOCAL_APPROVED_ASSETS_001/REPORT.md`。

## 当前新增：8关几何章节试玩

打开 `experiments/chapter_preview/index.html`。由12原创候选筛选8关，整块彩色占格可拖动、右键旋转、R重置，真实填满后逐关到章节结束。仅几何试玩，未完成动物素材。原熊猫白兔第一关仍在 `experiments/panda_v2/index.html`，源码/正式PNG未改。生成与验收见 `tasks/LEVEL_GENERATOR_001/REPORT.md`。

当前第一章场景版：`experiments/chapter_preview/index.html` 已复用动物园背景和木框UI，8关从开始到章节结束连续可玩；全部动物以整块几何表示，熊猫/兔子图也不加载。参见 `tasks/CHAPTER_ONE_SCENE_001/REPORT.md`。

itch HTML5测试打包：`python tools/itch/build.py --browser`，输出根index.html的独立ZIP并对真实解压产物做子目录/iframe/全屏及8关回归。当前仅几何私测包，未发布itch；正式动物Demo等待全部11形状原图及G1-G4。见 `tasks/ITCH_DEMO_PACKAGING_001/REPORT.md`。

2026-10-26 第一批真实动物已接入chapter_preview：U5绿蛇、S4松鼠、T4猫头鹰均为HUMAN G3指定原始PNG；其他形状保持整块几何占位。八关数据、已批准熊猫白兔第一关和背景原图不变。技术验收和局部轮廓越界数据见 [本批报告](tasks/CHAPTER_ONE_ART_BATCH_001/REPORT.md)。当前可构建builds/itch/animal-puzzle-partial-animal-test.zip，尚非正式动物发行版本。

第二批已接入：P5河马、L4长颈鹿、L3柯尔鸭，当前八关共有六种正式整图动物，保持上一批和松鼠左移锚点，其他五种形状仍为几何占位。原图未切割、未重编码，技术验收与实际游玩截图见 [第二批接入报告](tasks/CHAPTER_ONE_ART_BATCH_002/REPORT.md)。

2026-10-27已按HUMAN指令复用原批准熊猫/白兔：chapter_preview第2/3/4/6关显示白兔、第8关显示熊猫，现为8种完整动物，仅D2/I3/I4仍占位；原图及旧正式第一关不变。参见 [复用验收](tasks/CHAPTER_ONE_EXISTING_ANIMALS_001/REPORT.md)。

2026-10-27第三批已接入：D2豚鼠、I3水獭、I4鳄鱼。现有八关的34个实例全部映射11种完整动物PNG，正常加载不再有几何占位；原图和既有关卡不变。源码与实际导出包均完成三种窗口连续八关操作验证；这是全美术本地测试版，尚未声明正式发布就绪。见 [第三批正式交接](tasks/CHAPTER_ONE_ART_BATCH_003/REPORT.md) 与 [发布门禁实际状态](tasks/CHAPTER_ONE_ART_BATCH_003/release_gate_review.json)。导出工具当前产物为builds/itch/animal-puzzle-chapter-one-test.zip。
