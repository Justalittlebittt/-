# 熊猫拼图 V2 · GitHub 源码状态

- 入口：`experiments/panda_v2/index.html`。
- 版本：已按用户验收的单文件 HTML 重整为可维护的仓库入口，尚未进行仓库版浏览器端到端回归。
- 资产目标：`assets/animals/panda_rect6_v2.png`（**目前不存在于仓库**）。
- PNG 目标 SHA-256：`8ebf034a8cc3e2ab7c25ec17a6861992f76c880275f5b6ebe07765db417d6f83`。
- 本阶段允许先验证代码结构、占格及交互逻辑；未部署 PNG 时只能看到占位图，不能当作真实美术接入通过。
- 被用户验收的原始单文件 HTML 含有该 PNG 内嵌数据，原始单文件仍属于聊天附件，不是 GitHub 中的可独立部署构建。
- 后续完成项：将 PNG 作为二进制提交上述路径、GitHub 独立读回核对、浏览器 G1/G2/G4 回归；如与用户验收单文件行为不同，以用户已通过的版本为准修复。
- 本次仅为实验源码归档；正式游戏引擎、关卡数量、发布配置未冻结。

## 本地接管回归（2026-10-22）

当前仓库版占位交互已在真实 Edge 无头浏览器验证；见 `tasks/CODEX_TAKEOVER_001/REPORT.md`。上述“尚未回归”为历史归档状态。正式 PNG 仍缺失。

直接打开 `index.html` 可玩占位版，无构建依赖。`levels.js` 保留原三关内容；`game.js` 保留并修复原渲染/交互，形状函数复用 `../first_playable_001/core.js`。正式引擎与关卡规模未冻结。

回归：`node experiments/first_playable_001/test.js`；安装 Playwright 并确保 Edge 可用后运行 `node experiments/panda_v2/test-browser.cjs`（也可通过 `PLAYWRIGHT_MODULE` 指向已有模块）。截图和 JSON 写入 `tasks/CODEX_TAKEOVER_001/`。当前浏览器测试显式针对缺图占位模式，正式图片到达后需新增真实素材测试，不能复用占位通过结论。

素材预检：使用有 Pillow 的 Python 执行 `experiments/panda_v2/check-asset.py`。缺图或哈希不符返回 2，绝不将其他版本替代目标。哈希与解码通过也只是预检，Alpha边缘/元数据/许可及真实运行仍需验收。
