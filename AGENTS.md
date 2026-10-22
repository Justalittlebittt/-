# Codex 项目入口（本地开发执行）

请阅读：`README.md` → `docs/contracts/ANIMAL_PUZZLE_PRODUCTION_V1.3.md` → `manifest/PROJECT_MANIFEST.yaml` → `state/PROJECT_STATE.yaml` → 本轮关联的 `tasks/` 与代码。历史合同只作参考，不替代 V1.3。

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
