# 通用美术生产管线 V0.4.1 — PROPOSED

**状态：PROPOSED / USER_REVIEW_READY（非 LOCKED）**  
**Owner：ART_EXPERIENCE（合同整合）；DEV_INTEGRATION 仅负责独立技术实现任务**  
**2026-10-20**。依据：`docs/contracts/ART_STYLE_V1.4.md`、`docs/contracts/ASSET_PIPELINE_V0.3_PROPOSED.md`、`docs/reviews/PIPELINE_GATE_A_AUDIT_2026-10-20.md`、`tasks/PIPELINE_GATE_A_001/handoff_dev_to_art.json`。本版针对V0.4补足固定资产数据接口；V0.3与V0.4均保留历史，不覆盖。实际进度永远读取 `state/PROJECT_STATE.yaml`；本文件中的设计条件不是运行证明。

## 1. 硬约束与语义
- 首款**完整可发布**游戏最多7天；不是7天造原型。出现累计成本失控，先缩减形状/姿态/物种/功能，再请求范围调整；绝不自动延期。
- 动物美术为原创或有明确适用许可；不复制影视/游戏角色设计。维持V1.4的动画电影式CG质感、细腻的**内部**毛皮/材质及**外部**透明边缘干净；不得通过强制模糊内部毛发来冒充边缘修复。
- `occupied_cells`是二维画面逻辑格，不是脚掌/地面投影；动物视角、体型、姿势均自由，以种属可辨和网格可读为条件。2D静态整图以90°旋转，碰撞只依赖二维逻辑形状。
- 任何`PROPOSED`文本、设计审查、合成夹具或生成器探测不得冒充 `G0 LOCKED`、真实动物 `G1/G2/G3/G4 PASS`。
- 路径以当前实际GitHub仓库为准：`docs/contracts/`、`manifest/`、`state/`、`tasks/<task_id>/*.json`、可验证后才启用的`assets/`；V0.3示意目录及历史UNVERIFIED/NOT_RUN只是历史记录。

## 2. 唯一最小生产路径（先证明再扩展）
`shape_request (DEV) → 视觉brief (ART) → 有界真实生成器探针 → 原始文件二进制保存/校验 → 统一RGBA候选(DEV) → G1/G2预检(DEV) → 候选合成预览(DEV) → ART整合一次视觉包 → HUMAN G3候选版本批准 → DEV正式接入与G4 → 发布集合`。

不得在目标生成器和二进制通道未证实前建设多模型抽象平台、批处理后台或全套A/B/C分割实现。生产时才需要`shape_id/occupied_cells/anchor_cell`的真实合同；在引擎、`cell_px`、显示profile未定前，候选仅为`EXPERIMENT`，不得伪造正式像素尺寸。

### 2.1 Generator capability probe（真实工具、非动物对象）
由ART规定可读性/视觉判据，DEV负责技术驱动/字节处理；不能把单Owner合并为一个跨角色任务。对**实际拟用免费且许可明确的生成器**执行小型、预先规定样本的非动物**单体**探测，记录：
- 输入：`probe_id`、`generator_id/version`、工具调用方式及许可证/来源、prompt全文SHA256、`seed_if_supported`、`silhouette_guide_optional`、`requested_output_mode`、样本数/重试次数/时间及费用预算。
- 原样输出：`source_ref`、原始二进制`sha256`、MIME（由字节检测而非扩展名推断）、width/height、颜色通道、alpha最小/最大/分布、主体数判据及人工/自动方法、剪影控制是否**实际观察到**、可复现级别（NOT_SUPPORTED/BEST_EFFORT/REPEATABLE_OBSERVED）、`failure_code`、来源/版权、证据路径、运行时间。
- 验收：**实际字节**可读；单体可识别；输出不截断；可获得干净边缘的RGBA候选；剪影控制仅在目标使用需要且模型实际支持时为门槛。**生成原生RGBA不等于透明正确**，纯不透明alpha不得标记透明PASS。seed重复也不构成跨版本复现保证。
- 失败与回退：原生透明优先；不通过且预算允许时才尝试**一条**中性背景+通用抠图路径；仍失败则`GENERATOR_CAPABILITY_BLOCKED`，停止、缩范围/更换单一工具，不反复穷举服务商。每个失败类别最多一次纠错重试；总探针样本量和时限须在任务请求内预设。无法通过当前工具实际调用模型时标记`NOT_RUN`，不可推定支持。
- 探针只说明**被测工具/版本/场景**能力；不能证明皮毛、细肢、黑白高反差动物或未来其他模型通用可生产。

### 2.2 PNG真实二进制交接协议
文件交接成功要求**发布方写入原始PNG bytes + 接收方从GitHub独立读回bytes并核对**，JSON文本里仅记录元数据/指针。严禁以`create_file/update_file`的UTF-8正文路径直接当作原始PNG二进制上传（也不得把base64字符串当PNG文件）。
- 首选已授权GitHub Git blob API，传`base64`表示的原始字节建立blob，再建立tree/commit/ref；或能严格支持二进制的Contents API。若当前连接器缺乏真正byte-aware读回能力，不能以返回SHA或网页可见为独立二进制成功；改用同样已授权且双方均可读写的二进制存储，否则标记`BINARY_TRANSPORT_BLOCKED`。
- 素材清单必填：`asset_id`、不可变`asset_version`、`source_tool/version`、`owner`、`license/right_to_use`、`provenance`、仓库相对`path`、commit和Git blob SHA、原始bytes `sha256`、byte_size、magic PNG `89504e470d0a1a0a`、IHDR宽高、RGBA解码、Alpha分布、接收回执/验证方法。
- Git blob SHA（Git对象哈希）**不等于**PNG SHA256。读回同一版本，比较SHA256，核对PNG头/IHDR、解码结果；校验大小及仓库/Action artifact保留期限。不可仅验证文本链接存在。
- **最小探针**：DEV单Owner生成1张程序合成的极小RGBA PNG，按所选字节通道提交至仓库；ART在独立工作页自行取回实际字节进行SHA256/解码验证，分别记录发送和接收回执。仅测试传输，不声称生成器或动物PASS；同一成功通道后续复用，不重复测试。
- 单独角色无法读取原始字节时，结果必须是`BINARY_READBACK_UNVERIFIED`；请求具体替代通道方案而非让用户手工转文件。

### 2.3 正式数据接口与版本继承（V0.4.1补充，禁止丢字段）

V0.4压缩了技术流程，**不能被解释为取消了V0.3 §6.1和§6.3的资产契约字段**。为防不同AI在下一轮各自猜测，规定以下向后兼容的最小字段集；新字段只增不减，确有冲突须独立Change Request。Schema设计意图为跨物种通用，`species_id`及`species_features`是内容**参数**，不得依据物种名切换放宽质量门禁。

```yaml
asset_request:
  request_id: string
  species_id: string
  pose_id: string
  shape_id: string
  occupied_cells: [[x,y], ...]       # 仅二维逻辑格、四邻接
  anchor_cell: [x,y]                 # 逻辑坐标，非脚掌落点
  species_features: [string]
  abstraction_brief: string
  pose_view_brief: string
  silhouette_brief: string
  silhouette_guide: optional[path]
  style_kit_version: string
  target_render_profile: string     # 尚未冻结时仅EXPERIMENT
  source_rights: string
  budget_limit: {iterations: int, cost_class: string}
```

```yaml
asset_output:
  image_rgba: path                  # 真RGBA二进制，经过独立读回
  master_image: path                # 保留非破坏性母图
  final_alpha: path                 # 经验证的最终Alpha；不可用guide代替
  metadata_json: path
  species_id: string
  pose_id: string
  shape_id: string
  occupied_cells: [[x,y], ...]
  anchor_cell: [x,y]
  cell_px: integer                  # 只有正式render profile冻结后才有值
  base_canvas_px: [w,h]
  art_bbox_px: [x,y,w,h]
  asset_version: string             # 修改图像/Alpha/裁切等须递增并重测
  style_kit_version: string
  source_license: string
  provenance_report: path
  approvals: {visual_by_user: "PENDING | APPROVED | REJECTED", source: "evidence_ref"}
  qa: {G1: string, G2: string, G3: string, G4: string, evidence: [path]}
```

- **中间态**可缺尚不存在的 `final_alpha`、`cell_px` 或引擎参数，但必须显式标 `EXPERIMENT`；不得构造假数值以符合正式Schema，不能进入`assets/approved`。正式资产任何必需字段缺失都为`QA_INCOMPLETE`。
- 原样生成输出（含原始bytes SHA256、生成器版本、输入哈希、来源和授权）、`silhouette_guide?`、`segmentation_mask?`、`final_alpha` 和`foreground_rgb`各自保留独立语义；前两种蒙版不等于最终Alpha，透明边缘的RGB去污染另行核验。
- `occupied_cells`的四邻接连通性与动物PNG的像素连通性不同；不能以细毛、尾巴、透明洞的断裂像素改变逻辑格，或以Alpha反推碰撞。
- ART产出视觉意图和候选；DEV负责完整Schema、真实Alpha/几何检测和运行时坐标实现。交接文件必须引用**真实仓库路径、提交与不可变asset_version**，不接受只写自然语言“同上一版”。
- **独立验收**：模型探针通过不代表真实动物细毛材质通过；非动物探针仅筛查工具的最低可用能力，跨种属风险类别另在Gate C由真实素材候选验证，最终只由用户确认G3视觉。未测就是`NOT_RUN`。

## 3. 技/艺Owner与审批避免循环
- **DEV**：形状与坐标、anchor/90°转换；生成器调用/Alpha处理技术适配；真实字节存储实现、G1格式/来源/G2几何/G4真实运行测试及修复，机器合成棋盘预览。
- **ART**：美术风格和物种可辨性、姿态/二维可读性视觉brief、候选美术与视觉缺陷处置、Style Kit和批次G3审美包；技术问题报DEV并附证据，不篡改碰撞真值。
- **HUMAN**：仅对明确版本的风格母版和视觉候选执行G3审美批准，以及真正项目级合同/范围/不可逆架构决策。AI不能代签。
- 顺序严格为：T0 DEV形状 → T1/T2 ART候选 → T3 DEV实际候选G1/G2**预检** → T4 ART提出视觉包/HUMAN **G3候选审批** → T5 DEV正式接入、必要G1/G2复验及**G4真实运行** → T6满足发布门槛。**G4不是G3的先决条件，G3不等于G4**。
- G0的跨角色文本审查可以结束为`DESIGN_REVIEW_COMPLETE`，只有必要的人类合同批准才可变更为LOCKED；用户单次合并视觉审批优先，避免每修一个技术细节都打断用户。
- Release = `confirmed_exact_G3_version ∧ actual_G1_PASS ∧ actual_G2_PASS ∧ actual_G4_PASS ∧ verified_rights ∧ manifest_consistency`；G5仅新章节适用。任何缺证据为PENDING/BLOCKED，而不是PASS。

## 4. Gate与失败退出
| 层级 | 已有证据 | 不得越界的结论 |
|---|---|---|
| Gate A | ART审计及DEV `PASS_DESIGN_REVIEW`，本V0.4交叉整合 | 仅可供用户审核，非LOCK/生产许可 |
| B1/B2 | GitHub远端合成CI的现有核验回执 | 仅合成RGBA/网格数学，完整Gate B未关闭 |
| Binary Probe | 未跑独立二进制回读 | 不可宣称PNG跨页可交接 |
| Generator Probe | 未跑真实生成器 | 不可宣称真实单体/透明/剪影控制 |
| Gate C | 未运行实际复杂材质/形体覆盖 | 不可宣称跨物种通用 |
| Gate D/G1-G4 | 正式素材与实际引擎测试未开始；G3需人审 | 不可发布 |

退出原因使用`INVALID_REQUEST`、`GENERATOR_UNAVAILABLE`、`GENERATOR_CAPABILITY_BLOCKED`、`NOT_SINGLE_SUBJECT`、`INVALID_ALPHA`、`BACKGROUND_SPILL`、`BINARY_TRANSPORT_BLOCKED`、`BINARY_READBACK_UNVERIFIED`、`HASH_MISMATCH`、`LICENSE_UNVERIFIED`、`SILHOUETTE_MISMATCH`、`GRID_READABILITY_FAILURE`、`ROTATION_ANCHOR_FAILURE`、`RENDER_ALIASING`、`QA_INCOMPLETE`；每次记录Owner、最小复现、证据、消耗和是否允许一次纠错。遇到权限/许可不明、真实字节不匹配、无可用生成器、超过预算直接BLOCK，不用同一失败重复循环。

## 5. Problem Elimination Pass
1. **Delete** 重复B1/B2、预建多生成器框架、所有动物先做精确Mask、对每个候选要求完整G4才可视觉审批。
2. **Avoid** 二进制未证实仍写文本指针、虚构`cell_px`、把合成数学等同于动物毛皮；在任务一开始统一出证据等级。
3. **Absorb/Reuse** 复用已有GitHub、CI测试、Handoff、既有状态及通用RGBA/G1/G2接口；成功的单一传输通道只探测一次。
4. **Substitute** 原生Alpha失败仅换一次中性背景通用抠图；不可用则停止或缩减艺术需求。
5. **Optimize** 只有生产中测到瓶颈才处理采样性能、批处理和多适配器。

## 6. 实施顺序与审查结论
- 当前**V0.4.1可以供用户审核**；无素材、无LOCK、无Gate A最终项目批准。
- 下一项真正必要的**DEV**单Owner任务：`BINARY_PNG_PROBE_001`——1张微型程序合成PNG，真正的二进制上传和可被另一个角色独立下载的凭证；不再做几何/Alpha数学夹具。探针成功再安排真实免费生成器能力探测（ART视觉判据先定；DEV技术接口独立任务）。若工具当前缺乏字节读回能力，先提交阻断证据与一种可实际验证的替代设计，切勿声称PASS。
- 仅在实际可访问生成器/素材、清楚许可证、闭合二进制交接后，才投入最小**非正式**真实材质候选，逐级进入Gate C/D；最终由用户批准视觉。
