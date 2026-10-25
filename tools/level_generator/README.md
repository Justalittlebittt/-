# 原创关卡生成与几何章节

`node tools/level_generator/generate.cjs` 重生成12个候选、指标及8关运行数据。`node tools/level_generator/test.cjs` 验证确定性、证据解、坏数据及原场景完整性。

数据结构：`{id,generator_version,seed,w,h,blocked:[[x,y]],pieces:[{piece_id,shape_id,occupied_cells:[[x,y]],art_asset_id:null}]}`。坐标x向右y向下，rot=0..3；只旋转不镜像。blocked是棋盘内不能占用的固定格。形状非空、整数、无重复且四邻接。保存的construction/proof仅为研究证据，运行levels.js不带它们。

求解器枚举唯一归一化旋转与平移，用不重叠覆盖搜索计数；相同形状按放置rank顺序破除实例交换对称性，count_status必须随solution_count一起使用。默认上限5000，达到上限写CAPPED_LOWER_BOUND。规范签名只比较固定方向棋盘＋障碍坐标＋旋转等价形状多重集，不含piece ID/颜色/例解，不实施棋盘全局旋转/反射同构。

选关为明确记录的策划候选编排，不以解数单独判难度。修改运行脚本/数据后：`python tools/version-runtime.py --entry experiments/chapter_preview/index.html`；浏览器测试会强制检查内容版本。

浏览器：`node experiments/chapter_preview/test-browser.cjs`，默认file://；PREVIEW_TEST_URL指定HTTP入口，PLAYWRIGHT_MODULE可指定已有Playwright。需Edge。新几何通用适配层复用原PuzzleCore.rotate/normalize，不改已批准第一关或图片。
