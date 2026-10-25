# itch.io HTML5 geometry test export

- `python tools/itch/build.py` builds `builds/itch/animal-puzzle-geometry-test.zip`, validates closure/limits/hashes and tests two-build byte determinism.
- `python tools/itch/build.py --browser` additionally extracts the actual ZIP in an isolated temporary directory, serves only that output below a nested path, runs direct/cross-origin iframe/fullscreen checks and all 8 levels via real mouse at 3 desktop sizes.
- `python tools/itch/test.py` rejects 10 broken archive/public-release cases.

Python standard library only. Browser QA requires Node.js, Playwright and Edge; set PLAYWRIGHT_MODULE if using a preinstalled module. Output defaults under ignored builds/; report JSON/screenshots are under tasks/ITCH_DEMO_PACKAGING_001/.

The build never edits the source entry, levels or images. Source resources must already pass their content-version guard. ZIP root contains the real index.html; all runtime resources are exact-case relative paths with content hashes. The browser export removes unused Node fallback imports and rewrites the background URL. Build manifest records source/content fingerprints, but excludes timestamps and changing Git HEAD metadata so identical content/toolchain produces identical bytes.

This is private geometric testing, not an animal-game release. --release fails explicitly. No itch API/credentials/uploader exist here, and browser QA is local HTTP/iframe simulation, not actual itch hosting acceptance. Follow the task report before a future authorized draft/upload.

Official requirements checked 2026-10-25: https://itch.io/docs/creators/html5
