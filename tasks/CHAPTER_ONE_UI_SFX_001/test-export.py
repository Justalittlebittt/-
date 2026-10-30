"""Verify UI sounds in the current extracted game ZIP; keep local QA outputs private."""
from pathlib import Path
import json, os, subprocess, sys, tempfile, zipfile

ROOT = Path(__file__).resolve().parents[2]
TASK = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT/'tools/itch'))
import build
archive = ROOT/'builds/itch/animal-puzzle-chapter-one-test.zip'
with zipfile.ZipFile(archive) as z:
    files = {n: z.read(n) for n in z.namelist()}
    manifest = json.loads(files['build-manifest.json'])
    assert set(manifest['operation_audio_map']) == {'rotate', 'place', 'invalid', 'complete'}
    cases = []
    key = manifest['operation_audio_map']['rotate']
    for label in ['missing_operation', 'tampered_operation']:
        broken = dict(files)
        if label == 'missing_operation':
            broken.pop(key)
        else:
            broken[key] = b'wrong sound'
        try:
            build.validate(build.deterministic_zip(broken))
        except (AssertionError, KeyError):
            cases.append(label)
        else:
            raise AssertionError('Invalid operation audio accepted')
    with tempfile.TemporaryDirectory(prefix='ui-sfx-', dir=ROOT/'builds') as tmp:
        z.extractall(tmp)
        subprocess.run(['node', str(TASK/'test-ui.cjs')], cwd=ROOT, check=True,
                       env={**os.environ, 'UI_ROOT': tmp, 'UI_REPORT_DIR': str(TASK/'local-package/ui')})
(TASK/'local-package/ui-export-report.json').write_text(json.dumps(dict(
    status='PASS_EXTRACTED_UI_SFX', negative_cases=cases), indent=2), encoding='utf-8')
