# GitHub Actions verification for ART⇄DEV handoffs

**Status:** operational procedure; does not itself prove any CI run.  
**Repository:** `Justalittlebittt/-`.

## Correct source of truth for Actions runs

For `push` or `workflow_dispatch` jobs, read the repository Actions REST endpoints through the connected GitHub app:

1. `GET /repos/Justalittlebittt/-/actions/runs?per_page=40` — discover actual run ID, workflow path, event, status, conclusion and `head_sha`.
2. `GET /repos/Justalittlebittt/-/actions/runs/<RUN_ID>/jobs` — identify actual job ID, step status and conclusions.
3. Use the GitHub connector's `fetch_workflow_job_logs(repo_full_name, job_id)` to obtain decoded logs. Record the executed command and its actual stdout/test count.
4. `fetch_workflow_run_artifacts(repo_full_name, run_id)` then `download_workflow_artifact(repo_full_name, artifact_id)`; inspect ZIP contents, CRC, machine report and actual output file validity when possible.
5. Verify `head_sha` contains the **latest relevant source fix**. Use commit ancestry/tree/content; a successful earlier run does not prove a later untested fix.
6. Return one evidence receipt with run ID, head SHA, logs, test counts, artifact ID and **scoped** PASS/FAIL; don't widen a synthetic fixture result into production G1/G2/G4.

### Never treat empty status queries as evidence no run exists

- `fetch_commit_workflow_runs` currently returns **pull-request-triggered** workflow runs only. An empty result for a `push` workflow is expected and is **not** proof of no Actions run.
- `get_commit_combined_status` reads the commit status API; GitHub Actions Checks may not be reflected in that list. Empty `statuses` is **not** CI failure or absence proof.
- Browser page access failures can be connector permission/navigation limitations; try the relevant Actions API endpoint instead.
- If direct Actions runs listing is genuinely inaccessible, record `REMOTE_CI_UNVERIFIED` with the attempted endpoint and its exact error; never invent run IDs or PASS.
- Avoid repeated blind polling. If no CI job after verifying path filters and trigger, check whether GitHub App/token-generated writes have suppressed auto-trigger; use an authorized explicit dispatch path if available, otherwise record the limitation rather than asking humans to repeatedly refresh.

## Actual reference examples

- B1: `https://github.com/Justalittlebittt/-/actions/runs/39372270875` — 23 assertions and 13 synthetic PNGs.
- B2: `https://github.com/Justalittlebittt/-/actions/runs/39373312644`, `head_sha=0f7965099f52dfee93b045090c2be1ed0ece1e58`, contains source fix `55990b9f94ccb240d4c79ca06325736fa404566b` in ancestry — 46 assertions and 14 valid RGBA PNGs.
- Neither B1 nor B2 tests generated animal sprites, actual matting, approved visual Style Kit or target engine G4.

This file is a debugging guide, not a locked game specification.
