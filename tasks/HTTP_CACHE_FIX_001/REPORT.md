# HTTP_CACHE_FIX_001

用户实际HTTP入口只出现深绿底。服务器日志显示新版game.js/scene.js已请求，而assets.js/levels.js仍复用先前缓存；新game.js引用animalAssets时旧资产脚本只有pandaAsset，因ReferenceError启动中断。此前全新file://浏览器回归未覆盖长期打开的HTTP页面。

Problem Elimination：不要求用户反复清缓存，不依赖给HTML自身添加version参数（子资源不会自动继承该参数）；给全部本地脚本/样式URL增加基于内容SHA256的版本号。tools/version-runtime.py可重复生成。运行依赖变化会换URL，缓存不会把旧依赖与新逻辑混装，PNG原始字节和玩法不变。更改运行脚本/样式后应先运行此脚本再提交/打包。

验证：test-http-cache.cjs以真实HTTP缓存启动旧版assets.js，先复现animalAssets is not defined和纯底色；同一浏览器再打开修复页，版本化URL读取新assets.js，4只完整动物与背景成功显示，pageerror为0，记录cache-report.json和修复前后截图。612×906视口与用户截图一致，场景完整等比居中，上下深绿为比例留边。

实际用户HTTP地址通过PUZZLE_TEST_URL交给test-content.cjs运行：77项交互检查与672旋转边界组合全部通过，无JS异常。没有再改背景、熊猫或兔子。当前该问题不需要用户清理浏览器缓存，重新打开修复链接即可。
