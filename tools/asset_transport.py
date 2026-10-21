#!/usr/bin/env python3
"""Byte-exact PNG transport through GitHub Contents API.
Usage:
  GH_TOKEN=... python tools/asset_transport.py upload /path/original.png assets/panda.png EXPECTED_SHA256
  GH_TOKEN=... python tools/asset_transport.py download assets/panda.png /path/verified.png EXPECTED_SHA256
Run in the SAME workspace that actually owns the original PNG bytes.
No re-encoding, PIL save, image export or preview attachment conversion.
"""
import base64
import hashlib
import json
import os
from pathlib import Path
import sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from urllib.parse import quote

REPO = "Justalittlebittt/-"
API = "https://api.github.com/repos/" + REPO + "/contents/"

def digest(raw):
    return hashlib.sha256(raw).hexdigest()

def call(method, path, payload=None):
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not token:
        raise RuntimeError("GH_TOKEN or GITHUB_TOKEN required; never commit tokens")
    url = API + quote(path, safe="/")
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    req = Request(url, data=body, method=method, headers={
        "Authorization": "Bearer " + token,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "animal-puzzle-asset-transport",
        "Content-Type": "application/json",
    })
    try:
        with urlopen(req, timeout=45) as res:
            return json.loads(res.read())
    except HTTPError as e:
        raise RuntimeError(f"GitHub HTTP {e.code}: {e.read()[:500]!r}") from e

def get(path):
    obj = call("GET", path)
    if obj.get("encoding") != "base64" or not isinstance(obj.get("content"), str):
        raise RuntimeError("GitHub did not return base64 file content")
    return base64.b64decode(obj["content"], validate=False), obj["sha"]

def ensure_png(raw, expected):
    if not raw.startswith(b"\\x89PNG\\r\\n\\x1a\\n"):
        raise RuntimeError("Input does not have PNG signature")
    actual = digest(raw)
    if actual.lower() != expected.lower():
        raise RuntimeError("SHA256_MISMATCH expected="+expected+" actual="+actual)
    return actual

def upload(source, target, expected):
    raw = Path(source).read_bytes()
    actual = ensure_png(raw, expected)
    sha = None
    try:
        _, sha = get(target)
    except RuntimeError as e:
        if "GitHub HTTP 404:" not in str(e):
            raise
    payload = {
        "message": "assets: upload byte-verified original PNG",
        "branch": "main",
        "content": base64.b64encode(raw).decode("ascii"),
    }
    if sha:
        payload["sha"] = sha
    result = call("PUT", target, payload)
    back, blob = get(target)
    if back != raw or digest(back) != actual:
        raise RuntimeError("UPLOAD_READBACK_MISMATCH")
    print(json.dumps({"status":"PASS","sha256":actual,"bytes":len(raw),
        "github_blob_sha":blob,"commit":result["commit"]["sha"]}))

def download(source, target, expected):
    raw, blob = get(source)
    actual = ensure_png(raw, expected)
    dest = Path(target)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(raw)
    if dest.read_bytes() != raw:
        raise RuntimeError("LOCAL_WRITEBACK_MISMATCH")
    print(json.dumps({"status":"PASS","sha256":actual,"bytes":len(raw),
        "github_blob_sha":blob,"local_path":str(dest)}))

def main(args):
    if len(args) != 4 or args[0] not in ("upload","download"):
        raise SystemExit("Usage: asset_transport.py upload|download LOCAL_PATH REPO_PATH SHA256 (download: REPO_PATH LOCAL_PATH SHA256)")
    op, first, second, expected = args
    if len(expected) != 64 or any(c not in "0123456789abcdefABCDEF" for c in expected):
        raise SystemExit("SHA256 must be exactly 64 hex characters")
    if op == "upload":
        upload(first, second, expected)
    else:
        download(first, second, expected)

if __name__ == "__main__":
    main(sys.argv[1:])
