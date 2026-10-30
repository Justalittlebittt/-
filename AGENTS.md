# Codex 项目入口（本地开发执行）

请阅读：`README.md` → `docs/contracts/ANIMAL_PUZZLE_PRODUCTION_V1.6.md` → `manifest/PROJECT_MANIFEST.yaml` → `state/PROJECT_STATE.yaml` → 本轮关联的 `tasks/` 与代码。历史合同只作参考，不替代 V1.6。

你是 **DEV_INTEGRATION**，唯一开发执行者。策划和美术分别属于 GPT 策划/美术页，用户拥有 G3 视觉与重大项目变更批准权；不要在旧 GPT 开发页分派新任务。

1. 先检查 Git 工作树、实际本机目录/可用工具、旧程序、当前锁定约束与缺失资产。未知写 `UNVERIFIED`；禁止声称远程 GPT `/mnt/data` 在本机存在。
2. 优先检查 `experiments/panda_v2/` 和 `experiments/first_playable_001/`，复用可靠逻辑，不擅自锁定正式引擎或改变已验收交互。
3. 用户视觉批准的原始 PNG 只在真实存在于本地 `assets/inbox/` 或已证实可信来源后才处理。校验源 SHA-256/版本和 PNG/RGBA；v1与v2熊猫哈希不同，不能混用。缺失时报 `ASSET_LOCAL_MISSING`，先用占位图跑逻辑，不重生成替代获批图。
4. Codex负责 `git add/commit/push` 已核验的正式源文件与资源；无需用户逐图上传 GitHub。新资源入库后远端读回并核对版本/哈希。不要提交凭据、大型无关缓存或无许可素材。
5. 用最小上下文、按真实难度选模型、数据驱动的形状/关卡/图片、批量确定性回归、只跑必要的浏览器/G4；同根因无新信息停止重试并作 Problem Elimination Pass。每任务独立完整执行并提交证据，不滥用循环轮询。
6. 对正式素材逐项证明 G1/G2/G3/G4，未跑就 `NOT_RUN`。合同变更本身不是本地开发/PNG传输/游戏运行 PASS。
7. 状态报告仅列：已做、证据/commit、未完成与实际阻断、下一步；避免让用户承担技术调试。
## HUMAN 素材交付更新（2026-10-22，优先于历史候选路径/哈希要求）

用户明确指定本机 `C:/Users/Administrator/Desktop/动物拼图美术素材/` 为已视觉验收素材交付源。该文件夹当前及今后由用户交付的所有素材均视为 HUMAN G3 已批准，无需重复询问视觉批准。DEV 在每批导入时登记实际文件名、原始 bytes、SHA-256 和审批依据；后续文件变化以新哈希登记，不伪造为旧版本。技术G1/G2/G4仍需实测，开发自行修改图像视觉内容不继承原图批准。

当前 `熊猫.png` 的 SHA-256 为 `e88018fb1b8d992834f11ca25303161f28ce2643db6deefe1555c03f54311732`，用户已重新确认以此原图为准。当前运行资源为 `assets/animals/panda_rect6_desktop_001.png`，登记为 `PANDA_RECT6_DESKTOP_APPROVED_001`，历史身份为 candidate_v1。历史 V2 `8ebf034a...` 是不同文件，不再作为当前接入前提。保留历史记录，不将本图改称该V2字节。允许直接从桌面交付源复制原字节入库，不要求重复复制到 inbox。

背景交付例外（2026-10-23）：当前第一章背景仅视觉方向获批；桌面第一张背景原图含烘焙棋盘和关卡牌，不能按通用文件夹批准规则推定为正式独立运行背景。阶段A仅取两侧无UI环境区域作临时装饰，等待独立环境原图及确切G3。

## HUMAN 单关界面覆盖指令（2026-10-23，当前运行优先）

用户明确取消当前完整流程交付，当前入口只做第一关。桌面第一张背景原图作为硬性运行素材完整显示，不再作为临时背景，也不再等待独立分层背景。此指令覆盖前述背景交付例外在本关中的限制。背景原字节存 assets/backgrounds/chapter_one.png。实际占格网格对齐原图5×4棋盘；一只完整熊猫合法放入即本次交互验证成功，并不要求六格熊猫填满20格棋盘。

只显示原背景、完整熊猫及成功后棋盘正右侧的下一关按钮。无额外等待入园、操作提示、旋转/重置栏、开始/章节流程。鼠标左键拖动和取回，右键整体90°旋转，R重置本关；取消及非法落点静默恢复。下一关内容不在本轮范围，按钮仅提供nextlevelrequest事件接口。

验收修正（2026-10-23）：HUMAN总体批准FIRST_LEVEL_SCENE_001外观与交互；此前单熊猫入盘触发下一关只算按钮测试。正式完成必须全部拼块合法落盘且占格并集覆盖全棋盘，无缺格/重叠/越界。当前只有6格熊猫、棋盘20格，正常游玩不会显示下一关；不得为了按钮出现而伪造完成或擅增正式动物。

当前内容更新：FIRST_LEVEL_CONTENT_001已由用户批准A/C两只完整熊猫、B/D两只完整四格兔子。原兔子哈希00ae48b4...；当前场景有四只真实动物可填满20格，不再是仅单熊猫测试。当前回归入口test-content.cjs，原test-first-scene.cjs为历史单熊猫状态。保持原背景和无额外UI。

运行交付规则：修改游戏JS/CSS后执行python tools/version-runtime.py更新HTML依赖内容版本号，再打包；对长期HTTP浏览器必须验证旧缓存升级，不只用全新file://上下文测试。test-http-cache.cjs覆盖旧assets.js缓存启动错误。

白屏防复发门槛：运行脚本/样式修改后执行tools/version-runtime.py生成，再执行--check或node tools/check-runtime.cjs；两个现行浏览器测试已内置版本校验，失败不得标回归通过。HUMAN已复验缓存修复成功，记录见HTTP_CACHE_FIX_001报告。不要以清缓存作为常规交付步骤。

2026-10-25：LEVEL_GENERATOR_001独立8关几何试玩入口experiments/chapter_preview/index.html，不替换panda_v2已验收第一关。12原创候选/8关为用户当前授权的设计试玩，非正式数量冻结。几何整块有颜色与单个ID，可整体旋转拖放，禁止把动物拆片。该入口资源版本生成使用tools/version-runtime.py --entry experiments/chapter_preview/index.html；生成器修改后重生成并验证确定性，实际HTTP连续通关通过后才能交付。

CHAPTER_ONE_SCENE_001当前交付：chapter_preview为带既有动物园场景的8关第一章，全部动物仍用完整几何块（不显示已批熊猫/兔子）。程序覆盖仅原背景烘焙棋盘内表面和牌上文字以适配当前关卡，原PNG与panda_v2正式第一关不变。场景回归应通过PREVIEW_EVIDENCE_DIR/PREVIEW_REPORT_FILE输出独立验收，勿覆盖历史关卡生成证据。

ITCH_DEMO_PACKAGING_001：当前可用python tools/itch/build.py --browser构建根index.html的itch几何私测ZIP并对实际解压物验证。不得把已有嵌套离线包直接冒充itch包；不从仓库源目录通过推定导出包通过。11种完整动物及其G1-G4接入前不得把几何包标作正式动物版发布；本工具--release拒绝。实际itch上传/HTTPS托管仍需单独执行记录。

2026-10-26 CHAPTER_ONE_ART_BATCH_001：用户授权chapter_preview将U5/S4/T4占位替换为精确最终绿蛇/松鼠/猫头鹰整图；元数据assets/animals/chapter_one_batch_001.json，源文件桌面蛇.png/松鼠.png/猫头鹰.png，均与美术handoff哈希相同。其他八种形状继续几何占位，不启用熊猫兔子于本入口。animals.js按shape_id复用整图、等比完整绘制，禁止切片/变形/裁格遮掩局部越界。专项回归tasks/CHAPTER_ONE_ART_BATCH_001/test-animals.cjs；历史几何截图保留。Edge suppressed contextmenu可能连续产生多次lostpointercapture，contextRotation标记保持至整次拖动结束，仅在左键仍按下时重捕获；真正cancel/blur必须回滚。构建报告使用--report-dir隔离历史证据；当前导出partial-animal-test.zip仍非正式发行包。

2026-10-26 HUMAN已复验批准SQUIRREL_ALIGNMENT_001（321429c）并要求写入合同。V1.6 §12明确形状→完整PNG映射、局部显示锚点随整图旋转、PNG/逻辑占格保持不变及实际验收范围；当前S4 offsetCells=[-0.2,0]为已批准对齐，不恢复旧居中值。通过记录见tasks/SQUIRREL_ALIGNMENT_001/approval_receipt.json。

2026-10-26 CHAPTER_ONE_ART_BATCH_002：用户本条派工明确G3批准桌面河马.png、长颈鹿.png、鸭子.png，分别P5/L4/L3。原始哈希/字节与渲染登记见assets/animals/chapter_one_batch_002.json。当前chapter_preview六种真实动物，其余五种形状仍占位，熊猫兔子正式第一关保持不变。sourceBounds仅用于透明画布留白的等比缩放与锚点登记，仍完整PNG一次五参drawImage，无源裁剪；P5 baseRotation=3匹配原图与既定P形。图层先几何占位、后动物、最后拖拽对象，避免色块截断动物轮廓。工具按注册表动态导出PNG数量；批量验收通过ASSET_TASK_DIR/ASSET_SPEC_FILE、ANIMAL_REPORT_DIR隔离证据。未来改图须按现行合同审批，不把技术登记参数当作修改逻辑形状授权。

2026-10-27 HUMAN明确“先直接复用这两张”：覆盖此前chapter_preview不启用熊猫白兔的解释，当前RECT6复用原panda_rect6_desktop_001.png、O4复用原rabbit_square4_ears_folded_v2.png，不改字节，不生成新图。章节现8种真实动物，仅D2/I3/I4几何占位；兔子第2/3/4/6关、熊猫第8关，既有关卡和panda_v2正式第一关均不变。新证据tasks/CHAPTER_ONE_EXISTING_ANIMALS_001/，元数据assets/animals/chapter_existing_approved_reuse.json。不得依据历史未启用记录撤销本次映射。

2026-10-27 CHAPTER_ONE_ART_BATCH_003：第三批D2豚鼠/I3水獭/I4鳄鱼已按HUMAN G3交接接入，原字节/注册参数见assets/animals/chapter_one_batch_003.json。chapter_preview现11种完整动物、34实例、8关，正常加载零几何占位；原8种注册、PNG、关卡、核心、背景均不变。长条I3第一关竖向放不进3×2是正确边界拒绝，不改关卡；四向放置测试在既有能容纳该方向的关卡执行。全美术本地QA不等于公开发行，来源/许可元数据未闭合与实际itch托管未跑须保留真实状态；tools/itch/build.py --release仍拒绝。当前导出builds/itch/animal-puzzle-chapter-one-test.zip，证据tasks/CHAPTER_ONE_ART_BATCH_003/。

2026-10-27 ANIMAL_CLICK_AUDIO_001：现有chapter_preview已有简洁音效接口audio.js，取代此前“无声音接口”的历史核查结论。仅在animalClickSounds初始JSON对象中配置正式本地声音路径，默认11项null，未交付音频不得混用tasks下QA短音。animalAudio共用缓存/音量/静音/限流/单声音，左键成功选中调用一次，重置/换关stop；音频失败不影响拼图。导出器复制原始音频、哈希命名并验证闭环。正常ZIP无QA音频；测试夹具包明确仅用于实际解压iframe播放与八关回归。

2026-10-30 HUMAN批准桌面「动物拼图素材/音频」11段“动物名_剪辑.wav”并授权实装，覆盖ANIMAL_REAL_VOICE_PROCESS_001待批准状态。现audio.js已映射11段1.5秒WAV，源交付哈希见tasks/ANIMAL_AUDIO_INTEGRATION_001/assets.json，声音更换使用新版本文件名并跑实际音频/导出回归。该目录为当前桌面素材根；美术原文件现置于其“美术”子目录。声音听觉批准不自动闭合来源许可。

2026-10-30 DUCK_HIPPO_REPLACEMENT_001：桌面美术/鸭子-替换.png、河马-替换.png已替换chapter_preview L3/P5映射，新版本路径及哈希见assets/animals/duck_hippo_replacement_001.json。旧图保留。鸭子offset[0,0.08]、河马baseRotation=3不变。局部交叠1190→666px，仍非零，勿声称完全消除。新注册src遵循现有导出器src单引号格式，完整依赖验证通过后才交付。

2026-10-30 CHAPTER_ONE_MUSIC_001：V1.6 §13单曲背景音乐已接入，点击开始播放，loop=true，音乐独立静音/音量控件18%默认；换关/R不重启。音乐源assets/audio/chapter_one_music_v1.wav按Soundza许可保守处理不提交独立音频，实际ZIP包含原字节；新检出先运行tasks/CHAPTER_ONE_MUSIC_001/import_music.py校验批准SHA导入，再运行test-export.py --build验证。不得假设gitignored缺失可静默跳过或用试听版替换。官方loop_seamless=false，未剪改音频；衔接听感待用户确认。许可范围见本任务报告，不扩大为所有Demo素材发行门禁已过。

2026-10-30 CHAPTER_ONE_UI_SFX_001：V1.6 §14四条A版UI声音已接入，原字节与合同/g链接一致。复用animalAudio三瞬时通道，音效开关与音乐独立；无通用pickup声音。完成声每关一次，重置/换关重置标志，绘制不触发。4个独立WAV同BGM按许可不进公开源仓库，克隆后用本任务import_sounds.py导入并核对哈希，再构建及test-ui.cjs/test-export.py。人声/动物音频单测计数须排除UI与BGM，以免将不同事件误算为动物重复叫声。
