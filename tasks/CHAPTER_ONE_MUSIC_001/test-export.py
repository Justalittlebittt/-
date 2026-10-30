"""Verify the actual exported music; --build includes the complete export regressions."""
from pathlib import Path
import argparse, hashlib, json, os, subprocess, sys, tempfile, zipfile

ROOT = Path(__file__).resolve().parents[2]
TASK = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--build', action='store_true')
args = parser.parse_args()
if args.build:
    subprocess.run([sys.executable, str(ROOT/'tools/itch/build.py'), '--browser',
                    '--report-dir', 'tasks/CHAPTER_ONE_MUSIC_001/package'], cwd=ROOT, check=True)
sys.path.insert(0, str(ROOT/'tools/itch'))
import build
archive = ROOT/'builds/itch/animal-puzzle-chapter-one-test.zip'
with zipfile.ZipFile(archive) as z:
    manifest = json.loads(z.read('build-manifest.json'))
    music = manifest['music_file']
    assert hashlib.sha256(z.read(music)).hexdigest() == '70433d5f18eb6f540f0e52feb203689eccf6b910a3d92753cefd612828bc1d58'
    files = {name: z.read(name) for name in z.namelist()}
    checks = []
    for label, mutate in [
        ('missing_music', lambda d: d.pop(music)),
        ('tampered_music', lambda d: d.update({music: b'not the approved track'})),
    ]:
        broken = dict(files)
        mutate(broken)
        try:
            build.validate(build.deterministic_zip(broken))
        except (AssertionError, KeyError):
            checks.append(label)
        else:
            raise AssertionError('Invalid music export accepted')
    with tempfile.TemporaryDirectory(prefix='music-package-', dir=ROOT/'builds') as tmp:
        z.extractall(tmp)
        subprocess.run(['node', str(TASK/'test-music.cjs')], cwd=ROOT, check=True,
                       env={**os.environ, 'MUSIC_ROOT': tmp, 'MUSIC_REPORT_DIR': str(TASK/'package/music')})
(TASK/'music-export-report.json').write_text(json.dumps(dict(
    status='PASS_EXTRACTED_APPROVED_MUSIC', music_sha256=hashlib.sha256(files[music]).hexdigest(),
    archive_sha256=hashlib.sha256(archive.read_bytes()).hexdigest(), negative_cases=checks,
    source_audio_bytes_unchanged=True), indent=2), encoding='utf-8')
