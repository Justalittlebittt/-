# LOCAL_APPROVED_ASSETS_001

Owner: DEV_INTEGRATION。合同V1.3，用户2026-10-22新增明确交付规则。

## 当前规则及版本

HUMAN确认 `C:/Users/Administrator/Desktop/动物拼图美术素材/` 当前及今后由其交付的全部素材均已视觉验收，以这些原始文件为准。DEV逐批登记具体哈希并负责G1/G2/G4，不重复索要G3。开发自行改图须另行处理视觉批准；未经修改的已交付原图无需重审。

本批只有 `熊猫.png`：1173853 bytes，PNG RGBA 1536×1024，SHA-256 `e88018fb1b8d992834f11ca25303161f28ce2643db6deefe1555c03f54311732`。直接复制原始bytes到 `assets/animals/panda_rect6_desktop_001.png`，未重导出、未改Alpha、未重画。历史candidate_v1是同一字节文件的旧名；用户重新确认采用它，注册当前桌面批准版本。历史8ebf034a...是另一V2文件，未冒充已到达，也不再作为本图接入的前置。

## 已运行

`check-asset.py`：原始SHA、PNG头、解码、RGBA通过；Alpha范围0–254，744563像素全透明，828301像素部分透明，无255像素。阈值1/16/128/240的bbox、六格主体覆盖率已记入asset-report.json。Alpha最大254不自动判失败，保留用户原图。每格Alpha≥128覆盖率约34%–67%，仅为读格分析证据，不更改occupied_cells。

`test-browser.cjs --real-asset`：真实Edge 155.0.4283.62载入实际PNG，18项交互检查通过，664个旋转/边界组合，鼠标键盘三关通关、非法回退、取回、取消、重置、重新开始、420px缩放，无JS异常。chapter-complete.png、scaled-approved.png、four-rotations.png为真实浏览器截图；DEV审查四方向未见明显裁切/错位或向矩形占格外侵入。图像旋转与占格使用一致包围盒，六格内有自然留白。四向展示不代替正式用户体验评价。

G3按用户明确批准记APPROVED。G1字节/RGBA/Alpha预检通过；完整边缘污染、许可/来源字段仍未完全闭合，不标整个发布Gate通过。G2逻辑和四向技术显示已检查；G4通过上述真实PNG交互范围，色觉辅助、完整发行构建、教程体验及正式发布验收未覆盖。历史占位报告保持原样。

## Git交付

本次提交包括原始PNG、准确哈希登记、用户交付规则、运行接入和可重放测试证据。推送后使用远端main抓取至独立临时对象库，git archive读回PNG并与源SHA-256比较，避免把Git blob SHA当PNG哈希。具体提交见本报告的Git历史；读回结果由当次执行输出及用户报告提供。
