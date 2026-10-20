# Animal Puzzle — Gate A static pipeline architecture audit (2026-10-20)

**Owner:** ART_EXPERIENCE  
**Status:** `PROPOSED / REVIEW_PENDING` — no contract revision or lock applied  
**Baseline:** `docs/contracts/ASSET_PIPELINE_V0.3_PROPOSED.md`, `docs/contracts/ART_STYLE_V1.4.md`, `docs/contracts/UNIVERSAL_PROTOCOL_V1.0.md`.

## Evidenced progress (not universal generator proof)

- Bidirectional file-level ART⇄DEV GitHub handoff: `TRANSPORT_SMOKE_001` PASS; autonomous cross-chat triggering still NOT_ESTABLISHED.
- B1 committed-source GitHub CI run `39372270875`: 23 assertions / 13 synthetic PNGs, artifact verified.
- B2 committed-source GitHub CI run `39373312644` at `0f796509...`: 46 assertions / 14 valid RGBA PNGs; fix `55990b9...` is its parent commit; archive CRC and all 14 PNG decodes verified.
- Scope of B1/B2 is geometry and simplified Alpha math; no image generation, real animal cutout, final render profiles, or engine G4 executed. **Full Gate B remains open.**

## Gate A findings and proposed dispositions

| ID | Finding | Severity | Proposed disposition | Single owner |
|---|---|---|---|---|
| A-01 | V0.3 §10 still says repo/transport `UNVERIFIED`, historically correct but now misleading if read as current | medium | Keep V0.3 immutable proposal history; use `state/PROJECT_STATE.yaml` for actual status; next contract revision may reference live state rather than hard-coded observation | ART |
| A-02 | Uniform schema and adapters exist on paper, but *real image generator* capabilities (true native RGBA, conditional silhouette, predictable single sprite) are not established | high | Add explicit `GENERATOR_CAPABILITY_PROBE` acceptance stage between adapter selection and enabling animal production; cannot assert all-animal success without evidence | ART owns acceptance and model requirements; DEV owns adapter implementation in separate tasks |
| A-03 | The workflow handles output Alpha but cannot infer actual species/pose identity or 2D occupied-cell *perceptual* readability from RGBA | high | Keep machine rejection vs ART visual review distinct; species/shape matching is a design constraint, not automatically recoverable from PNG | ART |
| A-04 | The document sketches `assets/candidates` as GitHub paths but cross-page binary asset transport has **not** been tested; GitHub connector text-file success is insufficient | high | DEV should identify a feasible shared binary source with integrity checks (Git blobs, signed references, etc.) and note free/size limits; do not upload genuine art during this review | DEV |
| A-05 | An unlimited fallback tree could exceed the 7-day full-game budget | high | Do not build all three adapters now; choose smallest demonstrably adequate first route; failure may stop/reassign pose/shape, never repeatedly regenerate indefinitely | ART (visual fallback policy) + DEV (implementation; separate task owners) |
| A-06 | `T4` human visual approval and `T5` actual G4 runtime have different prerequisites; do not demand G4 to approve a **candidate** before integrating it | medium | Preserve staged candidate `TECH_PREFLIGHT` → `VISUAL_APPROVAL` → `RUNTIME_G4` → `RELEASE`; clarify full Gate D concerns batch-production/release, not exploratory candidate proof | ART |
| A-07 | Two illustrative synthetic shapes are not a claim of coverage across fur, white/black, thin, hollow and appendage categories | high | Future Gate C evidence must address capability classes; avoid premature per-animal special-casing and do not demand final production animals before architecture review | ART/DEV via separate atomic tasks |
| A-08 | Prior user intent: human only normally checks visuals, not raw CI, coordinate math, PNG integrity or technical errors | high | Batch visual samples into one user-facing review, allow AI-to-AI tech repair without repetitive manual mediation | ART |

## Gate A draft decisions

**Keep:** V1.4 CGI material detail; clean exterior/Alpha; 2D occupied cells independent of floor projection; multi-species shape diversity; immutable contract/versioned handoffs; ART visual vs DEV technical ownership; candidate-first release gates.

**Change in next pipeline revision (pending cross-owner review):**
1. Express adapters via a runtime `capability_manifest` and bounded `generator_probe` with truthful failure categories; no claim of guaranteed model compliance.
2. Define image transport as an independently tested **binary asset channel**, not infer it from text-only Handoff PASS.
3. Distinguish `synthetic_Gate_B1/B2`, `generator_probe`, `cross_material_Gate_C`, and `production_Gate_D`.
4. Make frozen or missing engine/display parameters explicit; they are not reasons to invent dimensions, nor should they block architectural review.

**No automatic approval:** Gate A stays `PENDING_CROSS_OWNER_REVIEW`; G1/G2/G3/G4 and full Gate B/C/D stay NOT_RUN. No real animal assets are produced by this audit.

## Recommended next cross-owner action

DEV reviews A-02/A-04/A-05/A-06 for concrete technical feasibility and writes a short structured response. ART then consolidates a narrow pipeline V0.4 **proposal**, requests human intervention only if a true product/visual/locked-constraint choice must be made. The goal is to eliminate repeated transport/CI plumbing loops and move to the actual **universal image-production decision**, not keep producing trivial synthetic PNGs.
