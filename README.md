# AI Smart Grading System

Academic prototype with a React client, Spring Boot application/API, Python AI service, and MySQL persistence.

```text
React (5173) → Spring Boot (8080) → FastAPI AI service (8501)
                         ↘ MySQL (3306)
```

The backend stores questions, typed student answers, AI evaluation text/scores, professor grade overrides, and feedback. The existing application does not currently upload handwritten answer files through Spring Boot or persist criterion-level evidence. The Streamlit OCR demo is separate from the production React → Spring → FastAPI path.

## Prerequisites

- Python 3.11 or 3.12
- Java 21
- Node.js and npm (the lockfile is provided)
- MySQL, with the database schema created from `database/schema.sql`
- Network access on first AI model use if models are not already cached

## Local setup and start (Windows PowerShell)

From the repository root, prepare local environment values. Spring Boot does not read `.env` automatically; set these in the shell used to launch it. Use a private local MySQL password and a randomly generated JWT signing secret at least 32 characters long.

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/ai_smart_grading'
$env:DB_USERNAME = 'root'
$env:DB_PASSWORD = '<your-local-mysql-password>'
$env:JWT_SECRET = '<random-secret-at-least-32-characters>'
$env:AI_SERVICE_URL = 'http://localhost:8501'
$env:CORS_ALLOWED_ORIGINS = 'http://localhost:5173'
```

Create the MySQL database/schema (review the script before applying it to a non-empty database):

```powershell
mysql -u root -p < database/schema.sql
```

Start the AI service in one terminal:

```powershell
cd ai
..\.venv\Scripts\python.exe -m uvicorn api:app --host 0.0.0.0 --port 8501
```

For a fresh Python environment instead:

```powershell
cd ai
py -3.12 -m venv ..\.venv
..\.venv\Scripts\python.exe -m pip install -r requirements.txt
..\.venv\Scripts\python.exe -m uvicorn api:app --host 0.0.0.0 --port 8501
```

Start Spring Boot in another terminal (set the environment variables in this terminal too):

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Start the frontend:

```powershell
cd frontend
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`. The backend validates the existing schema (`ddl-auto=validate`) and will not create it.

## AI service endpoints

- `GET /health` — liveness check.
- `POST /ai/grade` — existing backward-compatible request used by Spring Boot. Fields: `questionText`, `studentAnswer`, `expectedAnswer`, `markingCriteria`, `keywords`, `maxMarks`. It returns the existing score, similarity, and keyword-count fields. This legacy scorer still uses the existing similarity/keyword weighting and must not be treated as final professor-approved grading.
- `POST /ai/grade/rubric` — additive rubric request with `studentAnswer`, `rubricCriteria` (each containing `name`, `marks`, optional `description`, `keywords`, and `synonyms`), and `maxMarks`. Optional policies: `allowUnallocatedMarks`, `allowEvidenceReuse`. It returns criterion evidence, marks, review status, and a null confidence score because confidence is not calibrated. Model or evaluation errors return a safe service error.

The hybrid path combines exact concept evidence and the existing semantic evaluator. Semantic similarity is only one signal. Contradictions, absent evidence, and signal disagreement lead to review with no marks for that criterion. The current semantic cutoff is provisional; no professor-labeled evaluation dataset exists, so the hybrid result is an academic prototype and requires professor approval.

## OCR workflow and limits

`ai/app.py` is a standalone Streamlit demonstration that accepts PNG/JPG/JPEG images, segments horizontal lines, runs TrOCR, and uses the legacy scorer. It is not connected to React/Spring submissions. The separate `ai/ocr/handwriting_ocr.py` loads TrOCR at import time and returns text only. Neither path provides calibrated OCR confidence, PDF rendering, page-level persistence, or a professor correction workflow. The application therefore does not claim PDF or end-to-end handwritten submission support. The OCR output should be manually checked before use.

## Backend workflow

The backend stores per-question typed answer text, requests AI evaluations for a submission, persists the returned AI score/evaluation, creates or updates a grade, and permits professor score/feedback overrides. Student/professor access is enforced by backend services. The present DTO and database schema do not persist rubric-level criterion evidence, OCR artifacts, or a distinct approval state for every answer.

## Tests and checks

Python focused tests (PowerShell, from `ai/`):

```powershell
$env:PYTHONPATH = '.;..'
..\.venv\Scripts\python.exe -m pytest tests/test_scoring.py tests/test_rubric_scoring.py tests/test_concept_matching.py tests/test_evidence_extraction.py tests/test_hybrid_evaluator.py tests/test_api.py -q -p no:cacheprovider
```

Backend tests (requires Maven dependencies and Java 21):

```powershell
cd backend
.\mvnw.cmd test
```

Frontend type-check and production build:

```powershell
cd frontend
npm ci
npm run build
```

Model-loading OCR tests can require model downloads and are separate from the deterministic grading tests.

## Demonstration path

1. Start MySQL, FastAPI, Spring Boot, and Vite using the commands above.
2. Register/log in as professor and student; create a class, assignment, question, expected answer, and marking criteria.
3. Submit typed answers as the student.
4. As professor, request evaluation from the results workflow, inspect AI evaluation text/score, and enter a final score/feedback override.
5. As student, view the resulting grade/feedback where the assignment workflow releases it.
6. Demonstrate the separate handwritten OCR prototype by running `streamlit run app.py` from `ai/` and uploading a PNG/JPG/JPEG. Verify recognized text before interpreting its legacy score.

## Known limitations

- No measured MAE/RMSE/kappa/precision/recall/F1 or OCR CER/WER: there is no labeled validation/test set.
- No reliable external academic retrieval, NLI contradiction model, or calibrated confidence estimate.
- Hybrid rubric scoring is available only through the additive Python endpoint; Spring Boot currently sends the legacy flat request and does not persist rubric evidence.
- Handwritten image/PDF submission is not wired into backend/frontend. PDF page rendering and OCR confidence are not implemented.
- Professor rubric input is currently stored as free text in the database; structured criterion authoring/persistence is absent.
- The current DB schema stores AI scores/evaluation text and professor grades, but not criterion evidence or a full reviewer audit history.
- `ai/app.py` is a demo with hard-coded sample question selection/keywords, not a production answer-sheet processor.
