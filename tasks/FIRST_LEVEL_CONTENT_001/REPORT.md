# 第一关四只完整动物 — 技术交付

DEV_INTEGRATION，现行合同V1.5，输入main e849408；用户已批准折耳白兔原图，不再生成新图。

桌面兔子.png与ART交接完全一致：00ae48b4ee3c9f413cf996c239625f35a9ba946a8648225ed5dea9dc269ace74，1208053 bytes，1254×1254 RGBA。直接复制到assets/animals/rabbit_square4_ears_folded_v2.png，B和D两实例共享一份图像数据，各自持有独立旋转和放置状态。A和C共享原熊猫字节，背景原字节不变。各动物完整绘制一次，无图片裁片、部件拼块或占位动物。

运行层仅小改资产注册、四实例关卡数据、原图整幅绘制和左右四个待放中心；公共形状旋转/放置/满格判定复用。A/C左侧、B/D右侧，按原图坐标适配视口；两只熊猫旋转到竖向也完整可抓取。没有增加界面文字、按钮、第二关或改变背景构图。

G1：原始字节、PNG头/解码、RGBA/尺寸/hash通过。兔子Alpha0–255，四角0；各格主体覆盖约45%–74%。Alpha>=128主体bbox(37,126,1237,1187)，低Alpha边缘延伸至图底，保留原字节。浏览器浅深底合成与实际棋盘检查未见明显底色边、主体裁切或大幅邻格侵入。源头记录为ART OpenAI image_gen及HUMAN确切版本批准，不额外推定未提供的工具法律结论。

G2：四邻接/整数/去重、四次旋转还原、672个旋转边界组合、全部占格均命中同一动物对象通过；运行层独立枚举得到16个实例区分合法解。四方向、相邻摆放和原图对齐截图已检查。occupied_cells不由Alpha推导，兔子仍严格2×2四格。

G4：真实Edge 77项检查通过，1280×720、1024×768、800×600分别由真实鼠标拖动四个实例完成AAABB/AAABB/CCCDD/CCCDD，不用合成补格。支持右键单击旋转、左键持有时右键旋转、R整关重置、非法旋转/碰撞回退、取回一只不影响另一只、取消、拖动中窗口缩放。普通与旋转后的真实四动物均填满20格；未满下一关隐藏，最后落盘后显示，拾起立即隐藏，点击发出既有nextlevelrequest事件。无JS pageerror。旧核心9项回归通过。

修复过程中发现Edge右键contextmenu即使preventDefault仍可能撤销pointer capture；事件轨迹证明左键仍持有时lostpointercapture先于pointerup出现。Problem Elimination：避免将此特定旋转手势产生的捕获释放误当真实取消，仅在已抑制右键菜单且左键仍持有时重新捕获；真正失焦/取消仍回退。旋转后真实落盘补充回归通过。窗口缩放测试等待resize取消事件完成再松键，消除测试事件时序竞态。

命令：node experiments/panda_v2/test-content.cjs（Playwright/Edge，PLAYWRIGHT_MODULE可指定已有模块）；python tasks/FIRST_LEVEL_CONTENT_001/verify-assets.py；node experiments/first_playable_001/test.js。证据见evidence/runtime-report.json、asset-report.json、technical-review.json和截图。

本次G1/G2/G4通过限定于所述真实资产和第一关桌面操作范围；不代表完整发行门禁通过。四动物真人体验仍待HUMAN/DESIGN反馈，无第二关。原test-first-scene.cjs和test-ui.cjs保留历史，当前测试入口为test-content.cjs。
