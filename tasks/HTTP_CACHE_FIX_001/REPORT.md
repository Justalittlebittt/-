# HTTP_CACHE_FIX_001

用户实际HTTP入口只出现深绿底。服务器日志显示新版game.js/scene.js已请求，而assets.js/levels.js仍复用先前缓存；新game.js引用animalAssets时旧资产脚本只有pandaAsset，因ReferenceError启动中断。此前全新file://浏览器回归未覆盖长期打开的HTTP页面。

Problem Elimination：不要求用户反复清缓存，不依赖给HTML自身添加version参数（子资源不会自动继承该参数）；给全部本地脚本/样式URL增加基于内容SHA256的版本号。tools/version-runtime.py可重复生成。运行依赖变化会换URL，缓存不会把旧依赖与新逻辑混装，PNG原始字节和玩法不变。更改运行脚本/样式后应先运行此脚本再提交/打包。

验证：test-http-cache.cjs以真实HTTP缓存启动旧版assets.js，先复现animalAssets is not defined和纯底色；同一浏览器再打开修复页，版本化URL读取新assets.js，4只完整动物与背景成功显示，pageerror为0，记录cache-report.json和修复前后截图。612×906视口与用户截图一致，场景完整等比居中，上下深绿为比例留边。

实际用户HTTP地址通过PUZZLE_TEST_URL交给test-content.cjs运行：77项交互检查与672旋转边界组合全部通过，无JS异常。没有再改背景、熊猫或兔子。当前该问题不需要用户清理浏览器缓存，重新打开修复链接即可。

## 用户复验与防复发（本次对接）

HUMAN明确反馈“试玩成功没有问题”，本次白屏修复经用户复验通过。

根因包括运行依赖未版本化、只给HTML加版本不能刷新其子脚本，以及开发验收只使用全新浏览器上下文，遗漏旧缓存升级场景。已记录为交付流程缺陷。

自动防线：
- tools/version-runtime.py 按文本内容SHA256生成全部脚本/样式版本号，规范化CRLF/LF以保持不同Git检出环境一致。
- python tools/version-runtime.py --check 只检查不改文件，版本不匹配返回非零。
- node tools/check-runtime.cjs 校验全部6项运行依赖；已测试故意破坏assets.js版本时会拒绝。
- test-content.cjs和test-http-cache.cjs在启动浏览器前强制执行版本检查，过期资源版本会阻止测试成功，不能再仅依赖开发者记得运行生成脚本。
- 保留可重复的旧缓存错误复现→同浏览器新版加载成功检查。用户修复后的实际HTTP通关77项检查结果保留。

验证：Python --check通过；Node六项依赖检查通过；过期版本负例被正确拒绝；真实Edge旧缓存升级检查再次通过，修复页0错误。

不能承诺所有未来加载错误永久为零。本次根因已有自动检查和回归覆盖；GitHub仅记录实际执行结果，不虚称已配置远端强制CI/分支保护。后续每次运行资源改动均按上述交付检查执行。
