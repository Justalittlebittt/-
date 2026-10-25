# ITCH_DEMO_PACKAGING_001 — HTML5 打包与验证

DEV_INTEGRATION，2026-10-25；已同步f7e4cb2和V1.6，剧情不在本任务范围。

## 已完成

当前几何第一章可导出独立itch测试ZIP；不是等待美术完成才做打包。原8关数据、运行玩法、正式第一关和PNG不改。当前入口的开始页已有简短操作说明：左键拖动、右键旋转、R重置、填满浅色格/斜纹障碍。保留原说明，不新增多余游戏内UI。

之前离线试玩ZIP入口在experiments/chapter_preview下，适合本地解压，不能直接当itch标准入口。本工具把HTML真正移到根index.html；JS/CSS移到js/、css/，背景到assets/。只在导出产物重写路径并给文件名加入内容hash，不修改源运行文件。geometry模块的Node require后备路径在浏览器产物中移除。ZIP不包含源码仓库、测试夹具、解题证据、动物图片、凭据或外部网络依赖。

目前8个文件，压缩1,990,413字节（约1.99MB），解压2,081,631字节，最长路径39字符。build-manifest.json保存原文件指纹、导出文件hash/大小、构建ID和几何私测标签。ZIP文件顺序、时间戳、权限固定；连续两次相同输入/工具链构建字节完全一致。构建源码版本为1.0.0。

当前ZIP SHA-256：75a58aa02b3209bcf096f62084f3bb89d403be9ad013aef9ba728cac283d6dfa。build_id=db398e8bae6fa9faffef。如以后运行资源或构建器变化，必须重新构建与核验，以当次build-report.json为准。

## itch 官方条件

核对日期2026-10-25；来源：https://itch.io/docs/creators/html5 。多文件作品以ZIP上传，提供index.html；文件名/资源引用大小写一致，使用相对URL。文档限额为1000文件、路径240字符、解压总量500MB、单文件200MB。脚本采用保守十进制字节阈值检查，当前远低于限额。文件名均ASCII（合法UTF-8），包内路径无反斜杠、绝对路径、越界或大小写冲突。

完整资源闭包、入口、背景路径、hash清单、无外部HTTP/服务依赖已校验。itch使用iframe，官方支持内嵌或全屏启动；本次在本地模拟子目录CDN托管与跨源沙箱iframe，并测试全屏调整。不是实际itch服务的确认。

建议后续项目设置：HTML Game，上传ZIP并标记浏览器运行，1280×720内嵌，Click to Play和Fullscreen Button开启，滚动条关闭；当前不声明Mobile Friendly。设置记录仅为建议，未修改任何itch账号或页面。

## 可重复命令

构建和静态/确定性检查：`python tools/itch/build.py`。

完整解压浏览器验收：`python tools/itch/build.py --browser`。

错误包负例及公开发布门禁：`python tools/itch/test.py`。

浏览器验证需Node.js、Playwright与Edge，可用PLAYWRIGHT_MODULE指向已安装模块。无需第三方Python包。Codex本机实际命令使用依赖运行时Python：`& 'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' tools/itch/build.py --browser`，并将PLAYWRIGHT_MODULE设为已有依赖node_modules/playwright路径。

构建默认先检查源入口内容版本号；源JS/CSS变化时先执行`python tools/version-runtime.py --entry experiments/chapter_preview/index.html`。缺依赖、错误路径或过期版本时失败，不生成假PASS。

## 实际验收

- 静态及重复构建PASS，文件清单hash均一致。
- 原ZIP解压到临时隔离目录；服务只读该解压目录、强制大小写、挂在/html/qa-upload/<build_id>/，缺失路径不回退到源码。资源请求全部落在包内，无missing或failed请求。自动favicon探测独立204处理，不当作游戏资源。
- 直接打开解压入口成功；另一个端口的父页面以sandbox=allow-scripts allow-same-origin allow-pointer-lock跨源嵌入，验证全屏进入/退出成功。
- 复用既有test-browser.cjs，新增可选PREVIEW_FRAME_SELECTOR选择游戏Frame；输入仍是真实鼠标/键盘，页面绝对坐标由iframe内canvas计算，不注入完成状态。三种窗口（1280×720、1024×768、800×600）完成全部8关，共24次真实关卡通关，362检查通过，无pageerror。R重置、右键含拖动中旋转、障碍/碰撞拒绝、取回、下一关、章节结束、重玩均覆盖。
- 10负例通过拒绝：缺root index、大小写错误、绝对路径、外部URL、缺背景、ZIP路径穿越、大小写碰撞、清单hash篡改、文件数超额、公开发布请求。
- 复核原候选确定性、证据解、正式第一关代码/PNG完整性通过。本次不改8关内容、原正式第一关、剧情或动物图。

构建验证初版在Windows沙箱临时目录出现权限错误；按Problem Elimination先删除静态校验的落盘临时步骤，改为内存检查ZIP。真正解压仅用于浏览器验收，在builds/itch下创建独立临时目录并在完成后清理。非游戏运行故障。

## 公开门禁及未完成

该ZIP明确为几何私测包，保留未完成动物素材提示。`--release`主动以PUBLIC_RELEASE_BLOCKED退出，不提供把几何版标成正式动物Demo的捷径。正式公开动物版需要11种完整动物的原图及G1/G2/G3/G4和运行接入；以后另行验收，不能从本任务通过推定。

没有发布或上传itch.io，没有butler推送、商店页编辑或账号操作；真实HTTPS/CDN及itch项目设置仍NOT_RUN。Firefox/Safari/移动端未测。工具链相同且输入相同才承诺本次演示的ZIP字节可复现；不声称任意压缩库版本都会逐字节一致。
