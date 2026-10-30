"""Import HUMAN-selected local music without changing its approved bytes."""
from pathlib import Path
import hashlib, shutil, argparse

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('source', nargs='?', default='C:/Users/Administrator/Desktop/动物拼图素材/音频/背景音乐.wav')
source = Path(parser.parse_args().source)
expected = '70433d5f18eb6f540f0e52feb203689eccf6b910a3d92753cefd612828bc1d58'
if not source.is_file():
    raise SystemExit('ASSET_LOCAL_MISSING: obtain the approved Soundza file locally; do not fetch a preview')
assert hashlib.sha256(source.read_bytes()).hexdigest() == expected, 'Approved music bytes differ'
destination = ROOT / 'assets/audio/chapter_one_music_v1.wav'
if source.resolve() != destination.resolve():
    shutil.copyfile(source, destination)
assert hashlib.sha256(destination.read_bytes()).hexdigest() == expected
print('APPROVED_MUSIC_IMPORTED_EXACT_BYTES')
