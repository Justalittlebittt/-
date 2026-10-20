> **HISTORY_ONLY**：本文件是双 AI 阶段的候选操作手册，现行新任务以 [统一制作合同 V1.0](../contracts/ANIMAL_PUZZLE_PRODUCTION_V1.0.md) 和 [当前状态](../../state/PROJECT_STATE.yaml) 为准。下文旧路径/两角色安排仅用于理解历史，不应作为新任务执行规范。已有交接事实不受影响。

# 美术AI ⇄ 开发AI：仓库协作操作手册（V0.1 / PROPOSED）

上游：`docs/contracts/UNIVERSAL_PROTOCOL_V1.0.md`、`docs/contracts/ART_STYLE_V1.4.md`、`docs/contracts/ASSET_PIPELINE_V0.3_PROPOSED.md`。

## 唯一事实源与启动

两个工作页均先读取：`README.md` → `state/PROJECT_STATE.yaml` → `manifest/PROJECT_MANIFEST.yaml` → 对应合同。历史聊天或AI记忆不能覆盖仓库现状。

- 美术页：`动物拼图美术001、002...`，角色 `ART_EXPERIENCE`。
- 开发页：`动物拼图开发001、002...`，角色 `DEV_INTEGRATION`。
- 人类：主要验收视觉审美；技术问题由有权限的AI自主检查、修复和回归。
- 每项原子任务只设一个Owner，不把ART+DEV共同填写为任务Owner。

## 交接顺序

1. DEV拥有形状库、坐标、锚点、渲染profile和游戏集成；它先提供合法形状接口（没有的字段标`UNVERIFIED`，禁止臆造）。
2. ART结合物种、姿态、抽象形体与Style Kit形成候选视觉方案。
3. ART写入`tasks/<task_id>/handoff_art_to_dev.yaml`，附候选原图、元数据与确切版本引用。
4. DEV收到后执行能实际运行的G1/G2技术预检，能自行修的技术问题就修，不让人检查Alpha或日志。
5. 需要改原图或姿态时，DEV通过`handoff_dev_to_art.yaml`附失败码、复现、截图返回ART。
6. ART仅在视觉基本达到可审状态时准备图像与差异摘要，请人类确认风格、可爱感、物种识别和视觉直觉。
7. 经明确视觉批准后，DEV负责游戏接入与G4，最终出具证据；未完成不得写PASS。

## 自动交接的真实性限制

GitHub仓库提供**可验证的文件传输与版本控制**，但这不代表两个独立聊天页之间可以自动互相发消息、自动运行任务或后台轮询。只有两个工作页实际验证读写权限后，才可写`shared_repo_access: VERIFIED_FOR_BOTH`。接收方仍需要真实的触发机制或在其工作页主动读仓库；不存在时，至多请用户一次性转发机器交接包，不要求其做技术判断。

## 失败与升级

- 代码、Alpha、缩放、旋转、文件格式：DEV负责修复和回归。
- 形体、脸、材质、可爱感、物种识别：ART负责修订；用户审美批准不能由AI代签。
- 核心机制、锁定合同硬约束、七天上限、许可风险：提交Change Request，请人类决策。
- 同类错误反复出现：先执行Problem Elimination Pass，修共性模块，不给单物种设隐式例外。
- 状态必须区分`PROPOSED`、`LOCKED`、`NOT_RUN`、`PASS`、`FAIL`、`BLOCKED`。

## 当前限制

这份文档是**协作操作手册候选**；截至2026-10-20，本次会话已验证GitHub仓库读写，但跨两个独立工作页的交接尚未实际验证。当前任务不是生成正式动物素材。
