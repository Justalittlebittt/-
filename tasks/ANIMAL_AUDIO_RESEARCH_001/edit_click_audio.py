"""Make uniform 1.5-second audition clips, preserving every input in a backup."""
import array
import hashlib
import json
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

ROOT = Path('C:/Users/Administrator/Desktop/动物拼图素材/音频').resolve()
TASK = Path(__file__).resolve().parent
STAGE = TASK.parents[1] / 'builds' / 'audio-edited-20261030'
NAMES = ['熊猫', '水獭', '白兔', '鳄鱼', '河马', '柯尔鸭', '猫头鹰', '蛇', '松鼠', '豚鼠', '长颈鹿']
TARGET = 1.5

def run(args):
    return subprocess.run(args, capture_output=True, check=True).stdout

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_entries',
                          'format=duration:stream=codec_name,sample_rate,channels', '-of', 'json', str(path)]))

def choose_window(source, duration):
    if duration <= TARGET:
        return 0.0
    # Compare short-block RMS energy to avoid selecting silence in long recordings.
    samples = array.array('f', run(['ffmpeg', '-nostdin', '-v', 'error', '-i', str(source),
                                  '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']))
    block = 160
    energy = [sum(x*x for x in samples[i:i+block]) for i in range(0, len(samples), block)]
    width = 150
    prefix = [0.0]
    for e in energy:
        prefix.append(prefix[-1] + e)
    start = max(range(max(1, len(energy)-width+1)), key=lambda i: prefix[min(i+width,len(energy))]-prefix[i])
    return min(start * 0.01, duration - TARGET)

def main():
    STAGE.mkdir(parents=True, exist_ok=True)
    receipt = []
    for name in NAMES:
        source = ROOT / (name + '.wav')
        original = probe(source)
        duration = float(original['format']['duration'])
        start = choose_window(source, duration)
        sound_end = min(TARGET, duration - start)
        filters = (f'atrim=start={start:.6f}:duration={TARGET},asetpts=PTS-STARTPTS,'
                   f'afade=t=in:st=0:d=0.01,afade=t=out:st={max(0,sound_end-0.03):.6f}:d=0.03,'
                   f'apad=whole_dur={TARGET},atrim=duration={TARGET}')
        output = STAGE / source.name
        run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', str(source), '-map', '0:a:0',
             '-vn', '-af', filters, '-ar', '44100', '-c:a', 'pcm_s24le', str(output)])
        result = probe(output)
        assert abs(float(result['format']['duration'])-TARGET) < 1/44100
        assert result['streams'][0]['channels'] == original['streams'][0]['channels']
        run(['ffmpeg', '-nostdin', '-v', 'error', '-i', str(output), '-f', 'null', '-'])
        pcm = array.array('f', run(['ffmpeg', '-nostdin', '-v', 'error', '-i', str(output), '-f', 'f32le', '-']))
        assert max(abs(x) for x in pcm) > 0.00001, 'Unexpected silent output'
        receipt.append(dict(file=source.name, original_duration=duration, selected_start=start,
                            duration=TARGET, original_sha256=sha(source), output_sha256=sha(output),
                            full_decode='PASS', peak=max(abs(x) for x in pcm)))

    # Deliver separate files; never replace, delete or move a user original.
    for entry in receipt:
        destination = ROOT / (Path(entry['file']).stem + '_剪辑.wav')
        assert not destination.exists(), 'Refused to overwrite existing edited file'
    for entry in receipt:
        source = ROOT / entry['file']
        destination = ROOT / (source.stem + '_剪辑.wav')
        assert sha(source) == entry['original_sha256'], 'Input changed during processing'
        shutil.copyfile(STAGE / entry['file'], destination)
        assert sha(destination) == entry['output_sha256']
        entry['edited_file'] = destination.name
        assert sha(source) == entry['original_sha256']
    report = dict(target_seconds=TARGET, originals_preserved=True, files=receipt,
                  notes='No time stretch or volume normalization; 10ms fade-in, 30ms fade-out; short files padded with trailing silence. Human listening review pending.')
    text = json.dumps(report, ensure_ascii=False, indent=2)
    (ROOT / '音频剪辑记录.json').write_text(text, encoding='utf-8')
    (TASK / 'editing_receipt_2026-10-30.json').write_text(text, encoding='utf-8')
    print(json.dumps({'edited':len(receipt), 'duration_seconds':TARGET, 'originals_preserved':True, 'all_decode':'PASS'}, ensure_ascii=True))

if __name__ == '__main__':
    main()
