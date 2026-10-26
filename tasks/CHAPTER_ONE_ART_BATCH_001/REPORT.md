# 第一章三种正式动物接入验收

DEV_INTEGRATION · 2026-10-26 · 起点 main `c49b224` · V1.6

已读取最新状态和 ART 最终交接。桌面三个文件虽然改成中文短名，但**原始字节与最终交接的 SHA-256、尺寸、大小全部一致**，未使用历史旧图。原图仅复制入库，无重新生成、重编码、切割、裁格或 Alpha 修改。

| 形状 | 桌面原图 → 仓库原图 | SHA-256 | 字节 / 尺寸 |
|---|---|---|---|
| U5 | 蛇.png → assets/animals/snake_u5_final_g3.png | 0fdb68ffa5a76ca6200c0b5602ed1e49d526bc9d62ae5deaf51fd978df6c9379 | 1413402 / 1536×1024 |
| S4 | 松鼠.png → assets/animals/squirrel_s4_clean_g3.png | e68f4b6f68a56e78716a04e0d5c81b827a19f67aa473b3308fe820c4f6c70440 | 1430213 / 1536×1024 |
| T4 | 猫头鹰.png → assets/animals/owl_t4_wide_g3.png | c57b9af6ed27ce2254aadf328720553899d2749b5056996412790f6700b9144c | 1178380 / 1448×1086 |

运行入口：`experiments/chapter_preview/index.html`。使用现有八关和原拼图核心，仅按 shape_id 映射这三张整图，影响七个既有关卡实例：U5 四个、T4 两个、S4 一个。其余八种形状仍为完整几何占位，不启用熊猫/白兔来替代。现有关卡数据、正式 panda_v2 第一关与已批熊猫、白兔、背景原始字节未修改。

G1 文件、RGBA、Alpha 与透明边缘技术项通过。三张均可完整解码，Alpha 范围分别 0–254、0–254、0–255；画布最外边 Alpha 最大分别 1、1、2，属于近透明像素，未作擅自清除。已查看白色、深色、粉色三背景缩放合成，未见可辨认残留场景、白黑底块或明显污染边。证据：`asset-report.json`、`evidence/*-edges.png`。本批只有 HUMAN 交付和最终 G3 来源记录，ART 交接未提供生成器/提供商/许可细目，独立发行许可元数据仍 **UNVERIFIED**，不能将本次文件技术通过当作全套发行许可结案。

G2 在测试范围内通过，**不声称轮廓逐像素等于格子**。三图均使用原始完整画布等比居中放入 3×2 格包围盒，猫头鹰保留原宽高比。旋转时整张图绕逻辑旋转包围盒中心转动；无逐格纹理裁片或遮罩。原 occupied_cells 与 ART 及既有数据逐项一致。

透明轮廓的实测事实：U5 空缺格 Alpha>60 面积为 0%；S4 右下空缺格局部尾根/身体边缘占 18.35%，左上 0.24%；T4 下方两角羽毛局部占 5.19% / 4.83%。该数值来自全图等比映射后的诊断采样，并非新设的通用放行阈值。12 个方向的空缺格中心均保持透明；真实第七关邻接画面和全局旋转后的四组邻接摆放可辨认、可独立取回。第七关标准解中，各动物与相邻动物/占位块未检测到双方 Alpha>200 的像素重叠。局部延伸仍原样可见，没有裁去或通过改逻辑掩饰；并非对所有可能邻接组合的穷尽视觉保证。

G3：沿用 HUMAN 对交接中三个精确最终版本的批准，本轮不替代用户审美验收。旧 `shape_audit_art_v1.json` 是历史旧候选审查，不覆盖新最终交接。

G4 实测通过：

- `test-geometry.cjs`：三张精确原图哈希、七个既有占格实例一致；672 个边界案例、52 个占格碰撞案例、三种动物四方向逻辑与独立坐标旋转对照。
- `test-animals.cjs`：Edge 真实鼠标 **123 项检查**，12 个动物姿态的整块拖拽/右键旋转/合法放置/取回、跟手、完整单次 drawImage 无切片、四方向邻接摆放、取回后 Next 隐藏、复位后恢复通关；重复捕获丢失、pointercancel、blur 与 R 回归。截图含 `actual-*-rotation-*.png`、`actual-three-animals-adjacent.png`、`actual-neighbors-rotation-*.png`。
- 最终 HTTP 入口：1280×720、1024×768、800×600，**362 项检查、24 次真实鼠标关卡完成、3 次完整章节**，包括开始→八关→结束→重玩，非法/碰撞回滚，下一关仅完整覆盖触发，无脚本错误。
- 实际 ZIP 解压物：隔离子目录、跨源 sandbox iframe、全屏进入/退出、同样 **362 项检查与24次关卡完成**；资源无缺失、无外部依赖。独立包包含 3 张新动物与原背景，12 文件、5894623 字节；两次构建字节一致，SHA-256 `da2914b9723680765f25f9dd1e1fa1d1376ecb37aee169fa57f0a4eb02feb8ae`。10 个负向打包/正式发布门禁案例拒绝成功。
- `tools/level_generator/test.cjs`：12 候选重生成一致、11 形状旋转、55 解放置，正式第一关源码与熊猫/白兔/背景对比历史已批基线均不变。

本轮实际修复了一个旧交互边界：Edge 在压制右键菜单后可能多次触发 lostpointercapture。旧处理恢复一次后清掉 contextRotation，第二次丢失便取消拖拽。Problem Elimination Pass 删除“提前清标记”这一步，标记只随本次完整拖拽结束而释放；只在左键确实仍按下时恢复捕获，真实取消/失焦仍回滚。只修复本轮 chapter_preview，未修改已批正式第一关。测试追加真实连续旋转和重复丢失事件复现，均通过。打包测试另修正了资源监测路径：导出 PNG 改为 assets/ 下的内容哈希名，不能继续只监测源仓库 assets/animals/ 路径。

可重复执行（Playwright 使用现有安装，必要时设置 PLAYWRIGHT_MODULE）：

```text
python tasks/CHAPTER_ONE_ART_BATCH_001/verify_assets.py
node tasks/CHAPTER_ONE_ART_BATCH_001/test-geometry.cjs
node tasks/CHAPTER_ONE_ART_BATCH_001/test-animals.cjs
python tools/version-runtime.py --entry experiments/chapter_preview/index.html --check
python tools/itch/build.py --browser --report-dir tasks/CHAPTER_ONE_ART_BATCH_001/package
python tools/itch/test.py --report-dir tasks/CHAPTER_ONE_ART_BATCH_001/package
```

结论限于三种真实动物的本地接入、技术测试和完整八关流程。仍有八种几何占位，未作正式动物完整版或 itch.io 在线上传验收。HUMAN 实际试玩反馈另行记录。远端最终二进制读回结果见本任务 `github-readback.json`。

GitHub实现提交：`2a20b0c5b779bd619b88d379935adc488a7d7a97`。已从该提交的GitHub raw地址实际下载三张PNG，全部HTTP 200，原始字节大小与批准SHA-256一致；不是仅比较本地文件或Git blob SHA。读回报告与脚本一起归档。
