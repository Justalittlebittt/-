# AI GAME DEVELOPMENT COLLABORATION PROTOCOL V1.0

## 0. PURPOSE

本协议用于：

- AI + AI 游戏开发协作
- 人类 + 多 AI 游戏开发协作
- 原型游戏
- 独立游戏
- 学习项目
- 商业项目
- 基于现有代码开发
- 从零开发原创游戏

协议不绑定：

- 游戏类型
- 引擎
- 美术风格
- 商业模式
- 平台
- 世界观
- 项目规模

核心目标：

```text
降低误解
降低重复开发
降低上下文丢失
降低版本冲突
降低错误交接
提高并行协作能力
提高验证可靠性
提高长期项目连续性
```

---

# 1. ARCHITECTURE

每个游戏项目由三层信息构成。

```text
UNIVERSAL PROTOCOL
通用协作协议
        ↓
PROJECT MANIFEST
具体项目定义
        ↓
ROLE / TASK CONTRACTS
角色和任务合同
```

Universal Protocol 不随项目改变。

Project Manifest 每个新项目创建一次。

Role Contract 根据项目复杂程度创建。

---

# 2. SINGLE SOURCE OF TRUTH

聊天不是最终事实源。

项目必须定义：

```yaml
source_of_truth:
  repository:
  project_state:
  contracts:
  evidence:
```

默认可信优先级：

```text
Current repository state
>
locked current contracts
>
current project state
>
verified evidence
>
historical documents
>
chat history
>
AI memory
>
AI assumption
```

发生冲突时：

高优先级覆盖低优先级。

AI 不得使用：

```text
"I remember..."
"probably..."
"should already exist..."
"the other agent likely..."
```

替代真实验证。

无法确认：

```yaml
status: UNVERIFIED
```

---

# 3. PROJECT MANIFEST

每一个新游戏必须建立 Project Manifest。

最少包含：

```yaml
project:
  id:
  name:
  version:

intent:
  project_type:
  learning_or_commercial:
  target_experience:

scope:
  target_length:
  target_platform:
  target_content_size:

technology:
  engine:
  language:
  repository:
  asset_pipeline:

gameplay:
  genre:
  camera:
  control_model:
  core_loop:

art:
  style:
  resolution:
  visual_reference:
  animation_model:

quality_target:

hard_constraints:

soft_constraints:

out_of_scope:
```

Project Manifest 只描述：

> 这个游戏是什么。

不描述具体任务怎么实现。

---

# 4. ROLE SYSTEM

项目可以根据规模使用不同数量的 AI。

最小配置：

```text
DEV / INTEGRATION
ART / EXPERIENCE
```

中型项目：

```text
DESIGN / DIRECTOR
DEV / INTEGRATION
ART / EXPERIENCE
```

大型项目可以继续拆：

```text
SYSTEM DESIGN
LEVEL DESIGN
NARRATIVE
GAMEPLAY ENGINEERING
TOOLS
ART
ANIMATION
AUDIO
QA
```

原则：

> 根据真实协作冲突拆角色，而不是为了组织结构而拆角色。

---

# 5. SINGLE OWNER RULE

任何 Task（任务）必须只有一个 Owner（负责人）。

正确：

```yaml
task:
  id: ENEMY_HIT_REACTION_V1
  owner: ART_EXPERIENCE
```

错误：

```yaml
owner:
  - ART
  - DEV
```

跨领域问题必须拆任务。

例如：

```text
ART:
HIT_FEEDBACK_CONTRACT

↓

DEV:
HIT_FEEDBACK_IMPLEMENTATION
```

---

# 6. AUTHORITY BOUNDARY

每个 Role（角色）必须定义：

```yaml
role:
  owns:
  may_modify:
  must_not_modify:
  requires_approval:
```

例如：

```yaml
ART:
  owns:
    - visual_style
    - animation_language
    - VFX_direction

DEV:
  owns:
    - gameplay_logic
    - runtime
    - save_system
```

目的：

避免两个 AI 同时重新设计同一系统。

---

# 7. CONTRACT-FIRST DEVELOPMENT

跨角色工作默认使用 Contract（合同）。

Contract = 已经确定、供另一个 AI 实现的结构化规格。

模板：

```yaml
contract_id:

version:

owner:

objective:

context:

inputs:

requirements:

locked_constraints:

allowed_changes:

forbidden_changes:

dependencies:

deliverables:

acceptance_criteria:

evidence_required:

known_risks:

status:
```

Contract 一旦：

```yaml
status: LOCKED
```

下游 Agent 不得私自重新设计。

---

# 8. HANDOFF PROTOCOL

Handoff（工作交接）不是总结。

它必须能够让另一个 AI：

> 不阅读前面聊天，也知道怎么继续。

标准：

```yaml
handoff:
  from:
  to:
  task_id:

  objective:

  completed:

  current_state:

  artifacts:

  repository_state:

  locked_decisions:

  unresolved:

  next_action:

  acceptance:

  evidence:
```

禁止使用：

```text
“继续按照之前讨论做”
“和刚才一样”
“参考上面的方案”
```

这种上下文依赖表达。

---

# 9. MACHINE-FIRST COMMUNICATION

AI → AI 默认不追求人类阅读体验。

优先：

```text
YAML
JSON
tables
state machines
IDs
file paths
numeric values
constraints
acceptance tests
```

减少：

```text
长篇解释
重复背景
修辞
人类式总结
```

Human-facing 内容与 Agent-facing 内容分开。

---

# 10. TASK ATOMICITY

任务必须 Atomic（原子化）。

意思是：

> 一个任务只解决一个主要问题。

差：

```text
Improve combat
Polish level
Fix UI
```

好：

```text
PLAYER_ATTACK_RECOVERY_V1
ENEMY_HIT_FLASH_V1
PAUSE_MENU_LAYOUT_V2
```

每个任务必须可以明确结束于：

```text
PASS
FAIL
BLOCKED
CANCELLED
SUPERSEDED
```

---

# 11. NO HIDDEN SCOPE

任务开始前明确：

```yaml
in_scope:

out_of_scope:
```

AI 不得因为：

```text
“顺手”
“以后可能有用”
“这样更漂亮”
“架构更完整”
```

自动扩展范围。

---

# 12. CHANGE CONTROL

任何已 LOCKED 的决定，必须通过 Change Request 修改。

```yaml
change_request:
  id:
  target_contract:
  current:
  proposed:
  reason:
  evidence:
  impact:
  affected_systems:
  migration:
```

默认：

```text
未批准 = 不改变
```

---

# 13. PROBLEM ELIMINATION PASS

当某流程出现：

```text
重复
高 Token
高人工成本
高算力
高失败率
频繁测试
频繁同步
```

禁止直接优化当前步骤。

必须先检查：

```text
GOAL
↓
HARD CONSTRAINTS
↓
SOFT CONSTRAINTS
```

然后按顺序尝试：

```text
DELETE
彻底删除

AVOID
改变上游使问题不产生

ABSORB
由已有系统承担

SUBSTITUTE
换一种问题结构

PRECOMPUTE / REUSE
只做一次长期复用

OPTIMIZE
最后才局部优化
```

---

# 14. REUSE BEFORE REBUILD

开发新系统之前必须检查：

```text
已有代码
已有工具
已有 Asset
已有 Engine capability
已有 Plugin
已有第三方开源方案
```

优先级：

```text
Reuse
↓
Extend
↓
Generalize
↓
Replace
↓
Build From Scratch
```

但：

> 不得为了复用而牺牲关键品质目标。

如果旧系统严重限制目标效果：

允许替换。

---

# 15. LEGACY IS NOT A HARD CONSTRAINT

已有项目结构默认属于：

```text
SOFT CONSTRAINT
```

除非明确锁定。

因此：

```text
旧引擎这样做
旧项目这样画
旧代码这样组织
```

不能成为拒绝更好设计的充分理由。

判断标准：

```text
效果
维护成本
学习价值
可迁移性
风险
工作量
```

---

# 16. GAMEPLAY / PRESENTATION SEPARATION

尽可能区分：

```text
GAMEPLAY STATE
游戏真实状态

PRESENTATION
玩家看到/听到的表现
```

例如：

```text
damage = 12
```

属于 Gameplay。

而：

```text
hit flash
screen shake
sound
particle
animation
```

属于 Presentation。

两者不应被不必要地强绑定。

---

# 17. VISUAL / COLLISION SEPARATION

Visual Bounds（视觉范围）与：

Collision Bounds（碰撞范围）

默认是两个不同概念。

禁止默认：

```text
图片多大
=
碰撞多大
```

同理：

```text
animation
interaction area
vision blocking
navigation blocking
```

也应尽可能独立定义。

---

# 18. CONTENT / SYSTEM SEPARATION

系统和具体内容尽量分开。

例如：

```text
Enemy System
```

不是：

```text
Wolf Enemy Code
```

如果系统可以合理泛化：

```text
Enemy
  ├ Wolf
  ├ Robot
  └ Creature
```

优先泛化。

但禁止为了未来假设提前构建复杂抽象。

原则：

> 至少出现两个真实用例，再考虑抽象。

---

# 19. AUTHORING VS PROCEDURAL

Authoring = 人工设计。

Procedural = 程序生成。

两种方式都不是默认更好。

根据目标选择：

```text
Narrative-critical content
关键剧情内容
→ Prefer authored

Repeatable variation
重复可变内容
→ Consider procedural
```

也允许：

```text
Hybrid
人工关键节点 + 程序连接
```

---

# 20. ASSET CONTRACT

任何正式 Asset（资源）推荐拥有统一元数据。

```yaml
asset:
  id:
  version:
  type:
  source:
  runtime_path:

  visual_size:

  anchor:

  collision:

  interaction_bounds:

  render_layer:

  animation:

  palette:

  dependencies:

  usage:

  status:
```

Asset 不只是文件名。

它是一份合同。

---

# 21. VERSIONING

重要内容必须有版本。

例如：

```text
PLAYER_SPRITE_V3
COMBAT_FEEDBACK_V2
LEVEL_FLOW_V4