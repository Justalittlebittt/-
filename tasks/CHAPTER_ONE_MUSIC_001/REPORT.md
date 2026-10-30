# 第一章背景音乐接入验收

2026-10-30，依据V1.6 §13及HUMAN“开始背景音乐计入”。单曲Buy Something! Shop Theme（Soundza sound id cmv5p16h800q306l5k0zz46go）。

## 来源与许可

桌面音频/背景音乐.wav：23284880 bytes，44.1kHz/24bit立体声，88秒；SHA-256为70433d5f18eb6f540f0e52feb203689eccf6b910a3d92753cefd612828bc1d58。该文件保持原字节，无裁剪/降噪/重编码/文件增益变化。

通过Soundza官方插件取曲目元数据及original文件用于本地内容比对。官方原版为OGG，不能冒称与用户WAV字节相同。7761600个解码采样对齐后，相关系数约0.99999999999996，固定增益约0.884097（约-1.07dB），残差RMS约6.88e-8，证明确为该曲目的固定增益WAV版本，而非仅同名。reference原版保留于忽略的builds/bgm-verification/，不接入或替换用户文件。证据source-verification.json。

2026-10-30读取官方https://soundza.com/license，当前标准许可更新于2026-10-07：允许随原创游戏分发、免费试玩和商业使用，免署名；禁止独立音频或素材库再分发及用于AI训练。当前音乐范围许可确认，不能替代整个Demo尚未完成的其他素材来源/发行门禁。曲目作者字段未提供，不虚构作者。

音乐本体不进入公开Git源仓库，确切路径assets/audio/chapter_one_music_v1.wav已忽略；实际试玩/ZIP包含该原文件。Git保存哈希、导入脚本和游戏代码。新检出仓库须运行python tasks/CHAPTER_ONE_MUSIC_001/import_music.py（也可显式传入已取得许可的原文件路径）；仅接受批准哈希，缺失时明确ASSET_LOCAL_MISSING，不静默下载试听版。

## 行为

音乐首次在用户点击开始后建立单一Audio并播放，原生loop=true；换关/R重置不重建不重播，动物叫声和音乐独立。右上角提供音乐开关及音量滑块，默认18%，最高40%，低于动物叫声当前60%设置；此数值不等于已证明所有录音的主观响度顺序，实际听感由用户确认。音乐静音不影响叫声。关闭页面pagehide暂停，新页面等待开始按钮，无自动播放尝试；加载或play失败由catch处理不阻断拼图。没有新增操作音效或第二首音乐。

官方loop_seamless=false。本轮保持用户批准声音，无自动切头尾、交叉混音或无缝循环保证。原生循环功能已验证，88秒末尾衔接听感待HUMAN试玩确认。

## 验证

- 源码跨域sandbox iframe：18项真实媒体/控件检查通过。
- 实际解压ZIP跨域sandbox iframe：相同18项通过，音乐原始SHA与桌面一致。
- 音乐循环检查通过两次seek到结尾前200ms，等待浏览器原生回到开头；并非实际等待两整段88秒，也不替代人的无缝听感批准。
- 13项原点击音效单元通过；11个动物音频不变，导出包10项叫声交互回归通过。
- 实际解压物连续八关/三窗口，24次真实关卡完成，共370项通过；无资源缺失或页面错误；全屏、子目录、大小写闭环保留。
- 两次构建字节一致；33文件，包括11动物、11叫声及1首音乐。ZIP约38.9MB；sha及build_id见package/build-report.json。
- 删除音乐或篡改音乐字节两个负向包均拒绝验收。原正式第一关、所有动物原图、背景、占格、八关和核心不变，见baseline-report.json。

## 复验

```powershell
python tasks/CHAPTER_ONE_MUSIC_001/import_music.py
node tasks/CHAPTER_ONE_MUSIC_001/test-music.cjs
python tasks/CHAPTER_ONE_MUSIC_001/test-export.py --build
```

试玩http://127.0.0.1:8765/experiments/chapter_preview/index.html。导出builds/itch/animal-puzzle-chapter-one-test.zip。实际itch上传仍未执行，不宣称正式发布门禁全通过。
