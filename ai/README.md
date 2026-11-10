# Python AI service

The AI service provides a legacy compatible FastAPI grading route, an additive explicit-rubric route, and a separate Streamlit OCR prototype. System architecture, complete local installation commands, security environment variables, API examples, test commands, demo workflow, and known limitations are documented in the [repository README](../README.md).

## Run FastAPI (Windows PowerShell)

From this directory, after installing `requirements.txt` into the repository virtual environment:

```powershell
..\.venv\Scripts\python.exe -m uvicorn api:app --host 0.0.0.0 --port 8501
```

Health check: `GET http://localhost:8501/health`.

The existing `POST /ai/grade` contract remains the same. The additive `POST /ai/grade/rubric` accepts explicit criterion objects with marks, description, keywords, and synonyms and returns criterion assessments, exact answer evidence, awarded marks, and review status. It does not return a calibrated confidence estimate. Semantic model availability is required for this rubric route; failures are returned as service-unavailable errors rather than as a grade.

## OCR demo

```powershell
..\.venv\Scripts\python.exe -m streamlit run app.py
```

The demo accepts PNG/JPG/JPEG images and uses TrOCR. It is separate from the backend submission workflow. It has no calibrated OCR confidence, PDF/page handling, or structured correction/persistence flow. Confirm extracted text before relying on its legacy score.

## Focused AI tests

From this directory:

```powershell
$env:PYTHONPATH = '.;..'
..\.venv\Scripts\python.exe -m pytest tests/test_scoring.py tests/test_rubric_scoring.py tests/test_concept_matching.py tests/test_evidence_extraction.py tests/test_hybrid_evaluator.py tests/test_api.py -q -p no:cacheprovider
```
