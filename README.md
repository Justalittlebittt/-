# 动物拼图游戏（AI 游戏开发）

原创动物园主题二维多格动物拼图；目标是七天内制作完整可发布首版，验证真实玩家反馈，非营收优先。首版只做运输与入园章节。

## 唯一现行规范入口

- **[动物拼图统一制作合同 V1.0](docs/contracts/ANIMAL_PUZZLE_PRODUCTION_V1.0.md)**：已获用户批准并作为项目设计基线。涵盖策划、美术、开发、关卡、资产接口及验收；**不代表真实素材/运行时已通过**。
- [通用 AI 游戏开发协作协议 V1.0](docs/contracts/UNIVERSAL_PROTOCOL_V1.0.md)：跨游戏的单 Owner、证据、交接与变更控制。
- [Project Manifest](manifest/PROJECT_MANIFEST.yaml)：待定/冻结的游戏参数；[Project State](state/PROJECT_STATE.yaml)：动态任务、测试与真实状态。
- [任务交接模板](interface/HANDOFF_TEMPLATE_V1.0.yaml)：新任务只引用当前统一制作合同。

## 三个执行工作页

- **动物拼图策划001 / DESIGN_DIRECTOR**：与你讨论玩法、关卡、玩家体验、有限形状需求和资源预算。
- **动物拼图美术001… / ART_EXPERIENCE**：多形体 CGI 视觉母版、动物资产与审美验收包。
- **动物拼图开发001… / DEV_INTEGRATION**：棋盘几何、引擎、Alpha 管线、自动回归与真实运行验证。

当前合同讨论与定稿在专用合同页面完成；聊天页面不是事实源，不代表跨页自动触发。角色通过仓库与确切引用交接，新任务依统一合同执行，技术修复不需层层加签。

## 历史与迁移说明

旧 [美术 V1.4](docs/contracts/ART_STYLE_V1.4.md)、[流水线 V0.3](docs/contracts/ASSET_PIPELINE_V0.3_PROPOSED.md)、[V0.4](docs/contracts/ASSET_PIPELINE_V0.4_PROPOSED.md)、[V0.4.1](docs/contracts/ASSET_PIPELINE_V0.4.1_PROPOSED.md) **仅作历史设计记录**，不作为新任务平行合同。历史任务、提交和证据不修改；其中引用的合同版本继续用于解释原任务。

现有 GitHub **文本**双向交接与 B1/B2 **合成**测试已通过；图片二进制跨页交接、真实生成器、正式动物资源、Style Kit 审美批准、真实引擎 G1–G4 **尚未完成**。现有 `BINARY_PNG_PROBE_001` 等任务按各自原始请求继续，不因改入口丢失证据。不得把测试夹具或锁定文本冒充已交付游戏。
