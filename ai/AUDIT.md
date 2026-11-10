# AI grading repository audit

## Phase 1: architecture and baseline

- The repository has a Python FastAPI grading service (`ai/api.py`), a separate Streamlit handwritten OCR demo (`ai/app.py`), and a Spring Boot application that calls the Python `/ai/grade` endpoint. The React app uses Spring Boot; it does not call the AI service directly.
- MySQL entities store questions, submissions, AI evaluations, grades, and feedback. Professor grade overrides are supported in the backend. The Python API response currently exposes score, similarity, keyword counts, and textual evaluation only.
- OCR uses TrOCR in the Streamlit demo and a second module-level TrOCR loader in `ai/ocr/handwriting_ocr.py`. PDF ingestion, page ordering, OCR confidence, and an OCR-to-grading API are not implemented in the inspected path.
- Embeddings use cached `all-MiniLM-L6-v2` loading in `answer_matching.py`, but encode each pair separately. No benchmark dataset or NLI model is present.
- Answer-key JSON examples contain question and reference answer only. There is no canonical uploaded rubric schema, retrieval index, academic source verification, or labeled calibration dataset in the repository.

## Existing features

- FastAPI validates grading request fields and the Spring HTTP client maps service failures.
- Legacy scoring combines cosine similarity and approximate keyword matching; model initialization is cached.
- A professor can override an AI grade through the Spring grade workflow.
- Handwritten image OCR and line splitting are available in the Streamlit demo.

## Critical findings

- `calculate_marks` divided by the keyword count without handling an empty list and accepted out-of-range/non-finite values.
- Fixed 70/30 similarity/keyword scoring can assign marks to irrelevant answers and is not criterion-based.
- `keyword_found` fuzzy-matches each word independently, which can count misspellings or unrelated phrases as evidence.
- Negation detection is local-window based, can over/under-scope negation, and does not establish contradiction or scientific misconception.
- API `confidenceScore` and `feedback` are always null; the API has no rubric criterion response or review flag.
- OCR models load at import time in one module; OCR output has no confidence and no low-confidence review gate. The demo does not support PDFs and its line splitting is heuristic.
- There are duplicate root/data copies of answer keys, images, and result artifacts; no clear source-of-truth policy is documented.
- No measured grading or OCR metrics can be claimed from the available examples. Existing OCR tests download/load models and only check non-empty output, not CER/WER.

## Integration and repository state

- Current branch: `integration/backend-completion`.
- Pre-existing user changes were present in `.gitignore`, `ai/pytest.ini`, OCR/scoring tests, `backend/src/main/resources/application.properties`, and untracked normalization/concept/semantic files, backups, and `remote-inspection/`. These were preserved except for requested grading module changes noted below.
- The checked-in application properties diff contains a literal database username/password where the prior version used environment variables. This is an integration/security concern; no credential value is reproduced here.
- The backend request uses string marking criteria and keyword list, while answer-key examples have neither a criterion allocation nor marks. A rubric API change needs a coordinated backend DTO and persistence/API decision; the current response contract has been retained.

## Phase 1 baseline test result

- `pytest ai/tests/test_scoring.py ai/tests/test_api.py -q` from the repository root failed collection because legacy tests import `grading` as a top-level package.
- Running from `ai/` then failed API test collection because it imports `ai.api` and the repository root was not on `sys.path`.
- These are test invocation/import-path issues. The corrected invocation and post-change results are recorded in the completion notes; no model or OCR integration test was run for this baseline.

## Proposed work and limitations

The safe incremental changes are input validation and legacy division-by-zero protection, plus an explicit criterion-scoring primitive that does not claim semantic correctness from keyword hits. Semantic evidence and partial support can be supplied by an upstream evaluator, but the current API does not carry criterion objects or preserve criterion-level audit records. OCR confidence, RAG, factual web verification, dataset calibration, and end-to-end review status require additional contracts/data not currently present. No model replacement or thresholds should be adopted without professor-labeled benchmarks.

## Implemented in this audit pass

- `grading/scoring.py`: validates legacy scorer inputs, clamps similarity to its expected range, and safely handles absent/empty keywords without division by zero. Added `score_rubric`, which allocates marks independently by named criterion, supports explicit fractional support, validates allocations, avoids reusing identical keyword evidence, and returns criterion explanations. Legacy `calculate_marks` and the API response shape remain available.
- Added deterministic tests for rubric allocation/partial support/invalid rubrics, empty legacy keywords, and basic concept positive/negative/not-only/empty cases.
- `concept_matching.py` was already an untracked user change and was not modified in this pass.

## Verification and remaining phases

- Focused suite: 17 passed (`test_scoring.py`, `test_rubric_scoring.py`, `test_concept_matching.py`, `test_api.py`; run from `ai/` with both service and repository root on `PYTHONPATH`).
- A broad `pytest -m 'not integration'` run did not produce a result before it was interrupted; tests without the integration marker execute top-level model/demo code, so the marker currently does not reliably isolate model-dependent tests.
- No OCR CER/WER or grading MAE/RMSE/QWK/precision/recall/F1 results are available because the repository contains no professor-labeled train/validation/test set. No accuracy improvement is claimed.
- Not implemented in this pass: OCR confidence/page handling, PDF OCR workflow, semantic/NLI calibrated rubric evaluation, external-source RAG, criterion-level API/backend persistence, audit trail, and calibrated review thresholds. These require data and API/storage contracts beyond the existing interface. Phases 2-9 therefore remain incomplete.
