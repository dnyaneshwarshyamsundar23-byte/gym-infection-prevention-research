# Rohan Research — Gym Infection Prevention Research Portal

## Architecture

- Frontend: React + Vite
- Backend: FastAPI
- Database: SQLite + SQLAlchemy
- Authentication: PBKDF2 password hashing + JWT
- Participant flow: Signup → Login → Pre-test → 12-module intervention → 7-day lock → Post-test

## Run backend

Open a terminal in `backend`:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Run frontend

Open another terminal in `frontend`:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`.

## Before using the system with participants

1. Replace `PRE_TEST_URL` and `POST_TEST_URL` in `frontend/src/components/Dashboard.jsx` with the participant-facing `/viewform` URLs of two separate Google Forms.
2. Do not give participants the `/edit` URL.
3. The portal records that a questionnaire was completed only after the participant confirms submission. Google Forms remains the source of questionnaire responses.
4. For real deployment, set a strong `SECRET_KEY` using the backend environment file.
5. Obtain your institution/ethics/guide approval for the final participant workflow before collecting research data.
