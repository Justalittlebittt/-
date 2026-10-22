# CODEX_TAKEOVER_001 — 本地接管审查

- 日期：2026-10-22（Asia/Shanghai）；Owner：DEV_INTEGRATION / CODEX_LOCAL。
- 合同：ANIMAL_PUZZLE_PRODUCTION_V1.3；输入 main `195456f`，包含迁移 `0cda33af2dbc74532252eb263b5136a02a0846b8`。
- 当前工作目录原为另一游戏仓库且工作树干净；本项目独立克隆到 `animal-puzzle/`，未覆盖原项目。克隆后的 main 工作树干净，与 origin/main 一致。
- 范围：既有熊猫 V2 三关审查、技术修复、回归、Git交付。未冻结引擎、正式关卡数、Style Kit、7天起点或改变策划美术决定。

## 已做

保留 V2 的三关、画布与占格放置逻辑；把关卡数据和交互代码从 HTML 分离。复用 first_playable_001 已有 normalize/rotate（整数、唯一格、连通性），不重建拼图引擎。历史 4x4 VERTICAL_SLICE 候选与 V2 三关是不同实验，未相互覆盖。

修复：抓取不再跳到中心，按抓取点跟随指针；已放置拼块拿起后可自由旋转；非法落点/取消恢复位置和旋转；取消捕获/失焦回退；只处理活动指针；拿起或取回立即失效完成状态；托盘按实际旋转尺寸排布，避免重叠和画布截断；选中边框不再受图片变换污染；非法放置文字提示；章节结束提供重新开始。缺图状态明确显示 ASSET_LOCAL_MISSING。

## 实际证据

- `node experiments/first_playable_001/test.js`：9项全部通过，旧程序复用回归。
- `node --check experiments/panda_v2/game.js`：通过。
- `node experiments/panda_v2/test-browser.cjs`：Edge 155.0.4283.62，18项通过，无 pageerror；664个四方向边界组合、各关合法解；真实 mouse/keyboard 事件三关通关，碰撞/越界回退，取回、取消、重置、重新开始与420px缩放坐标。求解器仅产出操作目标，通关通过指针事件完成。
- `browser-report.json` 保存用例名、解及运行结果；`chapter-complete.png` 与 `scaled-placeholder.png` 已人工式视觉检查（DEV截图审查），不代替 HUMAN G3 或玩家反馈。
- `check-asset.py` 实测输出 `asset-report.json`：ASSET_LOCAL_MISSING；仓库无任何正式PNG，Downloads匹配 panda/cartoon/熊猫 的候选文件亦未找到。没有假设其他GPT的路径可用。
- 初次浏览器启动受沙箱管道限制；改为获授权的沙箱外本地无头执行后通过。Git目录所有权差异采用单次 `git -c safe.directory=...`，不改全局设置。无无目的重试。

## 未完成与实际阻断

正式 `assets/animals/panda_rect6_v2.png` 不存在。预期 SHA-256 `8ebf034a8cc3e2ab7c25ec17a6861992f76c880275f5b6ebe07765db417d6f83`。旧 candidate_v1 为 `e88018fb...`，禁止替代。当前没有可读取的自动原始二进制来源；旧附件/内嵌PNG单文件不在本仓库。原始文件可批次交付至 assets/inbox，后续DEV负责提取原字节、校验、接入、Git提交和远端读回。

正式G1、图像G2、正式G4：NOT_RUN。G3保持历史版本范围，不推定V2正式获批。Alpha边缘、RGBA实测、四向正式图片对齐、邻接遮挡、窗口缩放美术表现、色觉辅助及许可完整性仍待真实文件。占位回归不等于正式游戏发布验收。尚无完整发行构建、玩家难度/重复关卡体验验证；最终引擎、资源规模等仍由合同角色决定。

## 下一步

原始V2 PNG（或带原始内嵌字节的已验收HTML）到达可访问批次后，由DEV完成G1/G2/G4及二进制远端读回。策划继续决定有限首章内容和体验预算，美术与用户负责确切版本G3。无需用户逐图上传GitHub。

本报告与代码及证据同一提交；提交号用 `git log -1 -- tasks/CODEX_TAKEOVER_001/REPORT.md` 可获取，避免自引用提交哈希。
