# 动物拼图游戏｜通用美术资产生产流水线合同 V0.3（双AI协作修订稿）

- **合同ID**：`ANIMAL_ART_PIPELINE_V0_3`
- **状态**：`PROPOSED / GATE A PENDING`（协作架构与接口已文本审查，未获跨角色正式锁定；不可称为技术实现或通用性PASS）
- **本轮变更目的**：将V0.2从“技术流水线概述”升级为可由**独立美术AI工作页 + 独立开发AI工作页**执行的分工、AI→AI交接、自动回归、失败闭环和人类视觉审批合同，减少用户在技术问题上的消息中转及人工操作。
- **继承规范**：《动物拼图游戏｜统一美术合同 V1.4》与《AI 游戏开发协作协议｜Universal Game Development Protocol V1.0》；保留V0.2关于二维占格、视角自由、风格统一、内部毛发保真、Alpha路径可替换、通用门禁、7天完整游戏上限的一切不冲突原则。
- **工作页命名**：美术页 `动物拼图美术001`、`002`……；开发页 `动物拼图开发001`、`002`……，序列相互独立。工作页是**角色界面**，不是单独事实源；不假定不同聊天窗口天然能相互读写或自行发送消息。
- **当前目标**：先冻结通用生产机制、责任和交接格式；**不生产正式动物素材**，不建立超过首版实际需要的重型平台。

## 0. 不可更改的产品和视觉原则

1. `occupied_cells`代表**游戏二维画面内的逻辑格子**，绝不是地面投影、脚掌面积或通过图像透明度反推的碰撞。
2. 动物朝向、视角、站/卧姿态、丰满程度及抽象形体自由选择；根据物种与目标二维格子联合设计，不能恢复统一顶部斜视或统一短腿大肚子模板。
3. 美术统一的是**偏真实的高品质动画电影CG质感、照明完成度、亲近可爱气质、色彩组织、外轮廓与透明边缘质量**。内部细短毛、鬃毛、绒毛、斑纹、羽毛和皮肤细节保真，不做预防性全图降噪。
4. 正式动物是一只动物的**静态二维RGBA图 + 逻辑元数据**。没有背景、说明文字、多视图拼贴或烘焙的场景接触阴影。允许游戏引擎将整张图按90°旋转，不要求骨骼动画或完整3D建模。
5. 同一输入/输出合同、校验器、证据规则和失败处理适用于所有物种；内部可采用**能力驱动**的原生Alpha、引导蒙版或分割Matting通用适配器，但禁止按物种名跳过验收门禁。
6. **7天指完整可发布首版游戏的开发上限**，不许把技术原型或生成成功示意图冒充完成品；首版仅运输/入园章节，不因为长期扩展目标而无限构建流水线。

## 1. 两个AI工作页与人类决策边界

### 1.1 ART / EXPERIENCE（美术工作页）

**Owns（单一Owner任务）**：
- `Style Kit`与可审核的跨动物审美母版：材质、照明观感、毛皮细节保真、轮廓美感、形体多样性。
- 每种动物/姿态/目标二维形状的**视觉可行性方案**：识别特征、视角、造型、候选轮廓和视觉资产生成/选型。
- 视觉候选与必要的单体视觉自审；接收DEV的技术报告后修正**视觉源头问题**，准备**一次可审美的用户验收包**。
- 人工审美审批状态的准确记录（只能引用用户明确反馈，不得自行伪造“用户已批准”）。

**Must not**：
- 私自改变玩法合法形状、占格真值、锚点变换算法、引擎采样/碰撞规则。
- 以视觉看着对作为技术通过证据；擅自将未审素材发布入正式库。
- 接管DEV的通用Alpha程序与自动校验器修复。

### 1.2 DEV / INTEGRATION（开发工作页）

**Owns（单一Owner任务）**：
- 玩法形状库、`occupied_cells`、`anchor_cell`、格子拓扑、坐标系、90°旋转算法与资产接口。
- 通用候选接入、生成器/Alpha处理适配器的**技术实现**、去色溢、透明边缘与缩放/采样处理、文件命名和元数据核查。
- 自动G1/G2及真实游戏G4测试、截图、差异报告、运行时回归与技术缺陷修复。
- 接收美术视觉候选后生成机器能产生的**可视化合成预览**，把视觉争议转交ART；不要求用户运行命令、人工检查图片通道或阅读日志。

**Must not**：
- 擅自改变获批的脸、体型、毛发质感、配色、轮廓意图来掩盖技术Bug。
- 用直接修改碰撞格子掩盖视觉越界，或以成功导出PNG冒充用户审美同意。
- 伪造没有实际运行过的G4 PASS。

### 1.3 HUMAN（用户）

**默认唯一例行工作：视觉效果验收**，包括是否可爱、物种是否可识别、风格是否一致、形体抽象是否令人满意、拼图画面是否直观美观。可使用一次Style Kit母版验收、代表性物种跨风格验收和必要的合并批次验收，**不需要对每个中间版本/技术调整逐次签字**。

**例外必须升级**：当涉及核心玩法方向、已LOCKED合同的变更、开发上限/范围扩大、重大不可逆架构选择、版权/使用权不明、两AI在职责边界上的无法消解的冲突时，需要用户决策。提问必须打包为**明确冲突、已试方案、成本/影响、建议决议**，不把技术诊断步骤留给用户。

**注意**：两AI可以完成技术自检，但**不能冒充用户的审美批准**；风格母版和正式视觉结果的批准必须有明确的人类验收依据。

## 2. AI与AI如何交换信息——现实条件与事实源

1. **逻辑协作≠聊天页面自动联网**。两个独立ChatGPT工作页不能因本合同存在就自动互相发消息或共享未持久化的图像。必须使用双方**实际上都能访问的项目仓库/文件夹/工具接口**传递合同、素材、报告与状态。未验证共享通道前，只把它标记`TRANSPORT_UNVERIFIED`。
2. **优先自动交接**：若双方已获授权访问同一个仓库或可互读的文件工作区，各角色以原子文件更新共享状态；接收方通过已存在的连接工具读取，不需要用户搬运每条消息。
3. **无可用共享写入通道时**：AI生成**一份可直接转发的机器可读Handoff包**，用户若必须转发，只做一次必要传输，不阅读或解释技术内容；不能声称已实现自动AI→AI通信。优先一次性批量交接，禁止用户反复回复“继续”来启动空轮询。
4. 事实优先级遵守Universal Protocol：**真实仓库状态 > 锁定合同 > 项目状态 > 经验证证据 > 历史对话/记忆**。若仓库不存在或不可访问，记`REPOSITORY_UNVERIFIED`，不得假称已提交代码或文件。
5. 任何Agent要变更对方拥有的已锁定字段，只能提交Change Request，不能在聊天中口头覆盖。

### 建议的共享目录（在真实存储建立后启用；这里是规范，不表示已建立）

```text
animal-puzzle/
  manifest/PROJECT_MANIFEST.yaml
  contracts/ART_STYLE_V1_4.md
  contracts/PIPELINE_V0_3.md
  state/PROJECT_STATE.yaml
  interface/shape_catalog.json
  interface/render_profiles.json
  interface/style_kit_manifest.json
  tasks/<task_id>/request.yaml
  tasks/<task_id>/handoff_art_to_dev.yaml
  tasks/<task_id>/handoff_dev_to_art.yaml
  tasks/<task_id>/change_request.yaml
  tasks/<task_id>/status.yaml
  assets/candidates/<asset_id>/...
  assets/approved/<asset_id>/...
  evidence/<task_id>/...
```

修改`state`与合同须有版本号、写入者、时间与引用的证据；禁止两个Owner覆盖同一个状态字段。素材版本使用唯一`asset_version`与可核对的文件校验和，防止“美术已改、开发仍接旧PNG”。

## 3. 任务拆分、阶段Owner与自动交接

| 阶段 | 单一Owner | 输入 | 输出和验收责任 | 默认人工介入 |
|---|---|---|---|---|
| T0 形状接口与规格 | DEV | 玩法需求、合法形状候选、屏幕约束 | 格子、锚点、尺寸profile、shape合同 | 无；重大玩法变更例外 |
| T1 动物视觉方案/可行性 | ART | DEV形状接口 + Style Kit | 物种×姿态×形体×轮廓的可审核视觉合同；若无法适配，向DEV提出变更申请 | 无，母版方向需审美决策时除外 |
| T2 视觉候选生成 | ART | T1视觉合同与参考集 | 单体候选（真实源文件）、简短自审及来源记录 | 无，使用批次候选减少打扰 |
| T3 自动格式/Alpha/几何预检 | DEV | ART候选 + shape合同 | G1/G2机器证据、合成图、问题代码；技术问题DEV自修，源图问题退ART | 无 |
| T4 审美验收包制作 | ART | 候选 + DEV真实合成样张及预检报告 | 仅提交技术预检基本就绪的方案；列出与母版差异、候选建议 | **用户只验视觉** |
| T5 正式素材技术导出/接入 | DEV | 用户审美批准的资产版本 + 锁定形状合同 | 标准RGBA/元数据、G1/G2复验与G4真实运行报告 | 无 |
| T6 回归与交付 | DEV | 已批准资产 + 实测引擎 | 状态、日志、截图、回归、可复现实证；如发现视觉问题回ART | 审美发生重大变化才再次用户验收 |

**任务按Owner拆原子任务，不能一个任务同时标ART+DEV两个Owner**。先技术预检再出用户视觉验收包，是为避免用户审阅注定不能落地的假透明图；完整G4可以在获批素材接入后运行，不需要提前虚报通过。中间候选不是正式资产。

## 4. 标准AI→AI Handoff（必须自足、可机读）

每次交接均包含**可核对的文件/引用与版本**，不允许“参考上一页”“和刚才一样”。

```yaml
handoff:
  handoff_id: "H-2026-EXAMPLE-001"   # 示意，执行时生成真实唯一ID
  schema_version: "1.0"
  from: "ART_EXPERIENCE"             # 或 DEV_INTEGRATION
  to: "DEV_INTEGRATION"
  task_id: "EXAMPLE_ASSET_CANDIDATE"
  owner_completed_task: "EXAMPLE_ART_CANDIDATE"
  objective: "将已自审的单体视觉候选交给DEV进行技术预检"
  contracts:
    art_contract: "ART_STYLE_V1.4"
    pipeline_contract: "ANIMAL_ART_PIPELINE_V0.3"
    shape_contract: "<exact_version>"
    style_kit: "<exact_version>"
  completed: ["<事实，不能杜撰>"]
  current_state: "ART_CANDIDATE_READY"
  artifacts:
    - role: "source_image"
      path_or_ref: "<已存在的可访问路径或精确文件ID>"
      sha256: "<已计算哈希，未计算标UNVERIFIED>"
    - role: "candidate_metadata"
      path_or_ref: "<实际元数据>"
  repository_state: "<commit id 或 REPOSITORY_UNVERIFIED>"
  locked_decisions:
    shape_id: "<shape_id>"
    occupied_cells: "<list>"
    anchor_cell: "<x,y>"
  unresolved: []
  next_action: "执行通用 G1/G2 预检并返回结构化失败码/可视样张"
  acceptance:
    machine: ["可解码且Alpha有效", "合法二维形状", "变换对齐"]
    visual: "PENDING_HUMAN_VISUAL_APPROVAL"
  evidence: []
  result: "READY_FOR_DEV"           # 或 BLOCKED/FAILED
```

DEV回交ART时使用相同结构，外加：

```yaml
qa_feedback:
  verdict: "TECH_PREFLIGHT_PASS | TECH_PREFLIGHT_FAIL | BLOCKED"
  machine_checks: { G1: "<state>", G2: "<state>", G4: "NOT_RUN" }
  failure_codes: []
  evidence_refs: []
  change_owner_required: "ART_EXPERIENCE | DEV_INTEGRATION | NONE"
  repro_steps: "<可自动重放的最短步骤>"
  affected_asset_version: "<version>"
  next_owner_action: "<明确一次下一步>"
```

**必须验证消息引用真的可读取**。如果只贴字符串路径但接收方无法访问，交接状态为`HANDOFF_BLOCKED`，不能声称成功。

## 5. 无需人类中转的故障闭环

```text
ART 出候选与元数据
       ↓ (Handoff ART → DEV)
DEV 自动检测 Alpha / 格子拓扑 / 旋转 / 合成
       ↓
   ┌── 技术模块缺陷 → DEV自行修代码并重跑全部有关夹具
   ├── 图像源缺陷   → DEV附证据和失败码返ART
   ├── 风格争议     → ART对照母版修订视觉候选
   └── 玩法形状不适配 → ART提出Change Request给DEV评估
       ↓
候选技术预检满足要求 → ART汇总清晰视觉样张 → 用户审核视觉
       ↓
用户明确接受 → DEV正式接入并执行G4 → 版本化交付
```

- 可自动定位和修复的**同一技术问题**不逐步向用户播报或索要确认；修复后自动重跑相关回归并封存证据。
- 一类高失败步骤先进行Problem Elimination Pass（Delete→Avoid→Absorb→Substitute→Reuse→Optimize），不能陷入单动物反复抠图补丁。
- 设预算：同一输入有限候选次数、单模块有限修复轮次与超额退出；数值由当前项目预算明确，不在本协议凭空写死。超过预算可缩设计/换形状，不能无限生图，尤其不能牺牲7天游戏交付。
- `TECH_PASS`不等于`VISUAL_APPROVED`；`VISUAL_APPROVED`不等于`RUNTIME_PASS`；缺一不能进入正式发布资产集合。
- 持续失败时AI提供**根因/已试修复/复现证据/剩余风险/推荐替代**，由对应Owner自行处理；只有涉及项目级决策才升级用户。

## 6. 统一图像处理接口及技术路线（保留V0.2的通用性设计）

### 6.1 请求

```yaml
asset_request:
  request_id: string
  species_id: string
  pose_id: string
  shape_id: string
  occupied_cells: [[x,y], ...]  # 非空、四邻接连通；二维画面逻辑
  anchor_cell: [x,y]
  species_features: [string]
  abstraction_brief: string
  pose_view_brief: string       # 任意视角
  silhouette_brief: string
  silhouette_guide: optional[path]
  style_kit_version: string
  target_render_profile: string
  source_rights: string
  budget_limit: {iterations: int, cost_class: string}
```

### 6.2 技术处理路径

- A：生成工具有**真实原生RGBA** → 验证Alpha、前景边缘RGB和完整性。
- B：生成工具可接受姿态/剪影引导 → 可选引导蒙版，**不前置强制制作精确Mask**；最终仍需验证。
- C：图像不带可靠Alpha → 采用通用分割/Matting及颜色去污染；优先简洁可分背景，**不把复杂电影场景抠图设为默认路径**。
- 选择条件只依据实际工具能力和可观察质量信号，不允许“lion专用分割逻辑”。`silhouette_guide`是可选设计意图；`segmentation_mask`是可选中间值；`final_alpha`和对应`foreground_rgb`必须真实可核查。二维占格永远独立于透明像素。

### 6.3 正式输出

```yaml
asset_output:
  image_rgba: path
  master_image: path
  final_alpha: path
  metadata_json: path
  species_id: string
  pose_id: string
  shape_id: string
  occupied_cells: [[x,y], ...]
  anchor_cell: [x,y]
  cell_px: integer
  base_canvas_px: [w,h]
  art_bbox_px: [x,y,w,h]
  asset_version: string
  style_kit_version: string
  source_license: string
  provenance_report: path
  approvals: {visual_by_user: "PENDING | APPROVED | REJECTED", source: "<evidence_ref>"}
  qa: {G1: string, G2: string, G3: string, G4: string, evidence: [path]}
```

未冻结`cell_px`或引擎render profile时只能保存`EXPERIMENT`产物，不得猜数字伪装正式资产。2D Alpha不要求每一根毛发在像素层面同一连通块，`occupied_cells`的四邻接要求独立检查。

## 7. 验收门禁拆分：自动技术QA与人类审美批准

| Gate | 执行Owner | 自动/人工 | 什么算证据 | 用户是否需要介入 |
|---|---|---|---|---|
| G0 合同与跨角色接口 | ART提出视觉合同，DEV确认接口；各自分别拥有独立签收任务 | AI静态审查 + 必要项目级批准 | 文件版本、接口冲突报告、变更记录 | 仅硬约束/架构重大争议 |
| G1 RGBA与元数据 | DEV | 自动技术检查 + 疑点提报 | 实际文件解码、Alpha统计、背景合成、命名/许可/哈希、日志 | 否 |
| G2 二维形状/旋转/相邻 | DEV | 自动几何检查 + ART处理视觉可读性反馈 | 四方向变换、锚点及格子拓扑、邻接布局真实合成 | 否；审美必要时归G3 |
| G3 艺术品质与格子可读性 | ART准备审美包；**用户最终视觉批准** | ART预审 + 用户审美 | 获批图片版本、用户确认记录、Style Kit版本 | **是，仅视觉** |
| G4 真实运行时 | DEV | 自动化/真实引擎或浏览器实测 | 拖拽、旋转、边界、缩放、选中、通关、回归日志和截图 | 否 |
| G5 跨章节回归 | DEV技术，ART视觉母版比对；各拆原子任务 | 技术自动 + 必要时用户审视觉差异 | 新背景中可读性/稳定性证据 | 有重大视觉变化时才是 |

`G1/G2/G4`可在相应真实测试后由DEV标记客观PASS；`G3`没有用户明确认可只能`PENDING`，不能让AI代签。涉及跨Owner验收时**拆分任务**，不违背单Owner规则。

## 8. 代表性测试夹具与通用性证明

无需制作正式物种：用已有图、合成图或可重复的测试夹具覆盖以下风险类型：短毛和大斑纹（长颈鹿）、长鬃毛/尾球（狮子）、黑白高反差（熊猫）、细长1×3二维轮廓（狐獴）、弯曲/空洞轮廓（蛇/水獭型）、羽毛/角/尖耳等不规则边缘。

DEV对同一套输入/输出、Alpha处理、二维拓扑、旋转、缩放、证据日志进行自动回归；ART检查不同形体与母版是否具备统一CG电影美术观感。不能因为某单样本成功就声称“所有动物100%自动生成通过”。

## 9. 状态机、失败码与预算边界

**任务状态**：`DRAFT → READY_FOR_ART → ART_CANDIDATE_READY → TECH_PREFLIGHT_{PASS|FAIL} → VISUAL_{APPROVED|REJECTED|PENDING} → RUNTIME_{PASS|FAIL|NOT_RUN} → DELIVERED`。异常统一可置`BLOCKED / CANCELLED / SUPERSEDED`；必须保留旧版本及原因。

**关键失败码**：`INVALID_REQUEST`、`UNSUITABLE_SHAPE_POSE`、`NOT_SINGLE_ANIMAL`、`OFF_STYLE_OR_IDENTITY`、`INVALID_ALPHA`、`BACKGROUND_SPILL`、`SILHOUETTE_MISMATCH`、`CLIPPED_ANATOMY`、`GRID_READABILITY_FAILURE`、`ROTATION_ANCHOR_FAILURE`、`RENDER_ALIASING`、`HANDOFF_BLOCKED`、`QA_INCOMPLETE`。失败码映射到责任Owner和复现证据，不按动物名创建例外。

**释放条件**：`VISUAL_APPROVED`（用户已确认的确切视觉版本）∧ `G1 PASS` ∧ `G2 PASS` ∧ `G4 PASS` ∧ `source_rights VALID` ∧ `manifest references match`，才允许标记 `DELIVERED_FOR_RELEASE`。G5仅在新增章节适用。不要将待审批合同或技术测试原型冒充发布完成。

## 10. 审查结论与仍未实证项

### V0.2 → V0.3 变更摘要

- **保留**：上游美术V1.4、通用处理接口与Alpha能力分流、二维逻辑占格/旋转、真实材质内部保真、技/艺分层验收、通用失败码和7天控制。
- **新增**：两个独立聊天工作页角色、单Owner任务清单、机器可读双向Handoff、技术问题自动闭环、单次/合并视觉审批包、审美证据防伪、共享事实源/传输通道真实性检查。
- **修改**：原文宽泛的ART/DEV分工 → 精确到每阶段的Owner与禁止越权；G3明确由用户批准视觉，技术QA不再转嫁给用户；修正假定两聊天页可自动通信的潜在误解。
- **不修改**：已确认的动物审美方向、占格独立性、视角自由、形体多样化、素材版权规则、引擎真实验证要求。

### 尚需确认或实测

- 两工作页是否已具备**同一可读写项目事实源**：`TRANSPORT_UNVERIFIED`；不声称已经实现跨聊天自动消息。
- 项目仓库及Project Manifest具体所在位置：`REPOSITORY_UNVERIFIED`（待由实际文件/工具核验）。
- Style Kit跨物种视觉母版：`PENDING USER VISUAL APPROVAL`。
- Gate A（协作架构/角色接口确认）：`PENDING USER REVIEW`。
- Gate B（技术模块合成夹具）：`NOT RUN`；Gate C（跨物种覆盖）：`NOT RUN`；Gate D（生产启用）：`NOT RUN`。
- G1/G2/G4尚无针对V0.3完整管线的执行证据；G3未获正式母版批准，不可写PASS。

**使用原则**：接下来应优先验证可访问的共享交接通道与标准Handoff在两个独立工作页的实际可执行性；再验证通用技术模块，不启动正式动物批量生产。