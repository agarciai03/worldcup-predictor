# Backend — World Cup Watch Party Predictor

FastAPI + scikit-learn API.

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Docs available at `http://localhost:8000/docs`.

## Endpoints

- `GET /api/teams` — all teams
- `GET /api/teams/{id}` — team detail + squad
- `GET /api/players?sort_by=rating|goals|assists|shots|key_passes`
- `GET /api/players/{id}`
- `GET /api/matches` — all matches with predictions + watchability
- `GET /api/matches/{id}` — full detail incl. squads
- `GET /api/recommendations?limit=5` — top must-watch matches
- `POST /api/predict` — custom simulation `{ "home": "ARG", "away": "BRA" }`
- `GET /api/stats/summary` — tournament-level stats
