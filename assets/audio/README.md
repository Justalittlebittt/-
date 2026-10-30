# Animal click audio

Eleven 1.5-second desktop clips approved by HUMAN on 2026-10-30 are configured. See tasks/ANIMAL_AUDIO_INTEGRATION_001/assets.json for byte hashes and mapping. User sound approval does not establish complete public-release licensing; provenance remains UNVERIFIED for user-delivered replacements.

Put approved clips here, preferably with a new versioned filename when bytes change. In `experiments/chapter_preview/audio.js`, replace the appropriate null entry inside the initial `animalClickSounds` JSON object, for example:

```json
"I3": "../../assets/audio/otter_click_v1.wav"
```

The exporter includes configured local WAV/MP3/OGG/M4A files as original bytes with content-hashed output names. Missing configured files fail the build; unavailable audio at runtime fails quietly without interrupting animal input.

Shared settings/API: `animalAudio.volume` (0–1), `animalAudio.cooldownMs`, `animalAudio.setMuted(true/false)`, `animalAudio.stop()`. Each successful left press plays once; moving or rotating does not replay. A new voice replaces the old one; reset/next level stops it.

`tasks/ANIMAL_CLICK_AUDIO_001/fixtures/qa-click-tone.wav` is only a test tone, not an animal voice. It is excluded from the normal game export.
