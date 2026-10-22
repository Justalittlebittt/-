# 动物拼图｜参考游戏逆向 → 原创程序重建：研究交接 V0.1

- 日期：2026-10-22
- 性质：独立研究与候选功能规格，**不是新增锁定合同、不是G4通过报告，也不是正式研发代码**。
- 现行合同：`docs/contracts/ANIMAL_PUZZLE_PRODUCTION_V1.3.md`。唯一正式开发 Owner：**DEV_INTEGRATION＝本地 Codex**。
- 用户确认方向：基于《Dogs Organized Neatly》研究抽象功能 → 形成可测试规格 → 独立编写自研程序、使用原创动物/关卡。不得把原游戏 `data.win`、原关卡、反编译代码或素材提交至正式游戏。

## A. 已获证据（VERIFIED）与模型结论（MODEL）

- 用户上传的 ZIP 中有 GameMaker `data.win`（FORM/GEN8/CODE/OBJT/SPRT）、80份独立关卡 JSON。
- CODE 索引309个入口，但共享字节码之后为265份不同的字节码主体。
- 相关可定位入口：`gml_Script_cat_check_place`、`gml_Script_refresh_grid`、`gml_Object_objCat_Step_0`、`gml_Object_objCat_Mouse_53`、`...Mouse_54`、`...Mouse_56`。**仅证明字节码存在**，不能仅据名字推断键位和行为。
- 前期研究从碰撞掩码和80关配置恢复30种可移动形状、20种固定异形占格及特殊单格预占对象。四向旋转精确覆盖模型下全部80关可解，22关唯一解、58关多解。该数学模型**不是玩家体验难度**。
- **UNVERIFIED**：原游戏精确鼠标跟随、旋转轴、吸附阈值、撤销/重试按键、错误反馈、动态游戏播放；GML未完整反编译，原游戏也未在本研究执行环境实机运行。

## B. 原创重建候选合同（ORIGINAL_DESIGN，非原游戏行为证明）

采用数据模型 `{w,h,blocked:[[x,y]],pieces:[{id,cells:[[x,y]],anchor:[x,y]}]}`，格子整数坐标，x右y下；每块形状必须非空、无重复、四邻接且含锚点。逻辑占格是唯一碰撞真值；视觉Alpha不能充当碰撞范围。镜像不是90°旋转。

保存 `pose={at:[x,y]|null,rot:0|1|2|3}`，其中 at 是**世界锚点**，`occupied=at+rotate(cell-anchor,rot)`，顺时针90° `(dx,dy)→(-dy,dx)`。不因包围盒归一化引起抓取点跳跃。

拖拽使用 Pointer Events：`pointerdown` 记录目标拼块、命中原始格 `grabCell`、前状态、pointerId；`pointermove` 每次更新可见拖影与合法预览，业务状态直到 drop 才提交；需要 pointer capture，cancel 丢失捕获时恢复。候选锚点 `at=pointerGridCell-rotate(grabCell-anchor,rot)`，拖动中旋转应保持最初抓住的格子继续跟随指针。目标格必须在范围内且不得撞固定格或**其他**拼块（不要把自己算作占用）。

合法释放原子提交；非法释放不允许造成错位、丢失、幽灵块或角度突变，应回滚到抓取前完整姿态；完成判定须全部拼块合法且填满棋盘。关卡使用求解器证明初态有至少一解；**不要求唯一解，也不要求任意错误放置后仍可解**。

交互中“拖离棋盘退回托盘还是回滚原地”、“首版撤销或仅重试”、“具体提示/键位/吸附阈值/音效”未冻结，由 DESIGN 按V1.3确认；本研究沙盒模型有 undo 仅证明可实现，不强制首版采用。

## C. Codex 最小执行与验收

先读 `AGENTS.md`、唯一合同 V1.3、Manifest/State；复用而不是平行复制 `experiments/first_playable_001/`、`experiments/panda_v2/`。HTML/JS仍只是实验，正式引擎未冻结。已有历史风险：拖动时拼块不跟鼠标，必须有真实浏览器/游戏 G4 证据，不得以单元测试代替。

1. 用拥有使用权限的原游戏副本，优先 UndertaleModTool 分析 `data.win` 中上述鼠标/放置入口。REA+Ghidra只用于无法由GameMaker工具解决的EXE/DLL问题；缺工具或无参考文件如实标UNAVAILABLE，不进行重复无效安装探针。
2. 实现数据驱动、与美术独立的原创占格/四向旋转/抓点/拖放/提示/完成判定；必须保持单Owner，不能直接移植原GML/字节码。
3. 自动性质测试至少覆盖：形状校验、四次旋转还原、锚点不漂移、非法越界/障碍/其他块回滚、合法重新放置时排除自己、无误判通关、死局恢复。
4. 真正的 pointer 事件验收：
   - I01 抓取非锚点格 → 连续移动时肉眼/录屏确认跟手；
   - I02 拖动旋转四次 → 原抓点仍贴住光标，无漂移；
   - I03/04 越界、压障碍、与其他块重叠 → 非法预览+原子回滚；
   - I05 已落盘拼块再拖动与再旋转 → 不和自身碰撞；
   - I06 pointercancel/移出窗口 → 状态不变、拖影消失；
   - I07 CSS/窗口缩放、鼠标触摸 → 坐标无偏差；
   - I08 全局最后一格填满 → 只完成一次且下一关可进入；
   - I09 用 occupied_cells 而非Alpha验证；
   - I10 提供由DESIGN确认的死局恢复方式。
5. 只有真实游戏测试才能填写 G4=PASS；不可访问的已批准 PNG 标 ASSET_LOCAL_MISSING。CI通过不代表视觉G3或玩家体验好。

## D. 本轮研究沙盒实证

独立编写的 `cleanroom_core.cjs` + `test_cleanroom.cjs` 使用通用小型合成polyomino，不含参考游戏代码/美术/具体关卡，已在Node.js 22运行**20/20 PASS**：旋转、锚点与抓点、放置和回滚、碰撞、撤销/重置、通关、屏幕→格子映射等。

**此处仅存研究摘要与验收标准**，沙盒文件不自动存在于 Codex 本地；不得把20/20逻辑PASS误报为游戏交互G4或原游戏功能完全同一。

## E. 下一门槛与协作边界

参考游戏的精确吸附/旋转/错误反馈须由可信的GML行为摘要或Windows实机录屏再核验；无法验证的细节保持 `UNVERIFIED`。重大玩法与美术变更交DESIGN/HUMAN。该文件是可读取的研究参考，不修改合同、State或现有开发代码。
