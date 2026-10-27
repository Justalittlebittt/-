# 点击动物音效扩展

2026-10-27 · DEV_INTEGRATION · 基线 `8b55527`

已实现简洁的共用声音接口。`experiments/chapter_preview/audio.js`只有一份11动物声音映射和一个共用播放器；游戏仅在成功左键选中时调用播放，在重置/换关的begin入口停止旧声音。原PNG、动物渲染注册、占格、关卡、拖拽与旋转算法未修改，没有新增框架、音效UI或声源生成流程。

行为：

- 每种动物独立配置文件路径或null，多个实例复用同一配置与音频对象。
- 左键命中并拾取动物时播放一次，沿用既有locate命中规则；移动、右键旋转、空白处点击不重复播放。
- 共用音量、静音、150ms默认连点限流；同一时刻只保留一个声音，新声音停止前一个；重置/换关也停止旧声音。
- 资源未配置时不创建音频对象；媒体缺失、构造或解码/播放失败会返回false，失败不打断拖拽，也不产生未处理的播放Promise拒绝。
- 导出器读取同一初始JSON映射，把配置的本地WAV/MP3/OGG/M4A原始文件纳入音频依赖闭环并采用内容哈希文件名；拒绝仓库外/外网路径，缺失文件不能构建通过。

使用方式：把正式声音交付到 `assets/audio/`，在audio.js最上方的animalClickSounds对象里将对应null改为相对文件路径，例如 `"I3":"../../assets/audio/otter_click_v1.wav"`。声音配置与碰撞关卡无关，不需要每只动物一套程序。详见 `assets/audio/README.md`。

**目前没有正式动物音频，11项配置全部为null，交付游戏保持安静。** QA使用的120ms短音明确放在本任务fixtures目录，未绑定到正式配置，也不包含在正常交付ZIP；不能将测试音称为水獭或其他动物的正式叫声。

验证：

| 检查 | 实际结果 |
|---|---|
| 共用播放器单元测试 | 13项，通过默认空配置、缓存复用、重新播放、静音、音量上下限、限流、单声音替换、停止及构造/播放错误容错 |
| 源码HTTP真实Edge | 10项，通过真实媒体解码/播放、空配置、左键触发、拖动/右键不重播、空白点击、静音/限流与缺失文件后继续操作 |
| 含QA音频的实际ZIP | WAV确实包含在ZIP并从嵌套目录加载；跨源sandbox iframe真实点击播放10项通过，零未处理脚本错误；不是只模拟play()成功 |
| 同一解压包八关回归 | 370项检查，三种窗口尺寸、24次真实关卡完成、3次完整章节；全屏、结束/重玩和相邻动物操作正常，资源无缺失 |
| 音频导出负向 | 拒绝缺失音频、外网音频URL及仓库外文件共3项 |
| 正常交付包 | 配置仍全null，静态资源/哈希/路径闭环通过；两次构建一致，0个音频文件，未混入QA测试音 |
| 原有打包负向 | 10项错误路径/清单/资源/发布模式案例均拒绝成功 |

正常交付包为 `builds/itch/animal-puzzle-chapter-one-test.zip`。另一个 `builds/audio-qa/qa-tone-package.zip` 仅供自动测试，含短测试音；不作为正式声源交付。实际解压八关与音频播放验收跑在该QA包上，正常静默包做静态/确定性校验；源码空配置和音频启用均在真实浏览器单独验证。声音素材的人耳听审和其他编码文件的逐文件验收，待正式文件实际交付后执行。

命令：

```powershell
node tasks/ANIMAL_CLICK_AUDIO_001/test-unit.cjs
node tasks/ANIMAL_CLICK_AUDIO_001/test-browser.cjs
python tasks/ANIMAL_CLICK_AUDIO_001/test-package.py
python tools/itch/build.py --report-dir tasks/ANIMAL_CLICK_AUDIO_001/package
python tools/itch/test.py --report-dir tasks/ANIMAL_CLICK_AUDIO_001/package
```

使用现有Playwright/Edge，必要时设置PLAYWRIGHT_MODULE。本次是功能扩展与回归，不是声源交付或平台发布；原全美术版本的用户试玩通过记录保持有效，新音效配置需在后续实际音频交付时复验。
