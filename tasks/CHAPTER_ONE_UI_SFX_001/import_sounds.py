"""Restore approved licensed A WAVs from local HUMAN delivery, without transcoding."""
from pathlib import Path
import hashlib, json, shutil

ROOT = Path(__file__).resolve().parents[2]
source = Path('C:/Users/Administrator/Desktop/动物拼图素材/音频')
for asset in json.loads((Path(__file__).parent/'assets.json').read_text(encoding='utf-8')):
    original = source/asset['filename']
    if not original.is_file():
        raise SystemExit('ASSET_LOCAL_MISSING '+str(original))
    assert hashlib.sha256(original.read_bytes()).hexdigest() == asset['sha256'], 'Wrong approved A version'
    destination = ROOT/asset['file']
    shutil.copyfile(original, destination)
    assert hashlib.sha256(destination.read_bytes()).hexdigest() == asset['sha256']
print('FOUR_APPROVED_A_SOUNDS_IMPORTED_EXACT_BYTES')
